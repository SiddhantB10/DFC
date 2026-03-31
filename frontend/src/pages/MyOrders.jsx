import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import { FiCalendar, FiShoppingBag, FiFileText, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    expired: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-red-100 text-red-600',
    pending: 'bg-amber-100 text-amber-700',
  };

  const paymentStatusColors = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-600',
    cancelled: 'bg-slate-100 text-slate-500',
    refunded: 'bg-indigo-100 text-indigo-700'
  };

  const openInvoice = async (orderId) => {
    setInvoiceLoading(true);
    try {
      const { data } = await API.get(`/orders/${orderId}/invoice`);
      if (data.success) {
        setInvoiceData(data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to fetch invoice');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const printInvoice = () => {
    if (!invoiceData) return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Invoice ${invoiceData.invoice?.invoiceNumber || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            h1 { margin: 0 0 8px; }
            .muted { color: #6b7280; font-size: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
            .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; }
          </style>
        </head>
        <body>
          <h1>DFC Invoice</h1>
          <p class="muted">Invoice #${invoiceData.invoice?.invoiceNumber || ''}</p>
          <p class="muted">Issued on ${new Date(invoiceData.invoice?.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <div class="grid">
            <div class="card"><strong>Plan</strong><br/>${invoiceData.order?.plan?.name || '-'}</div>
            <div class="card"><strong>Duration</strong><br/>${invoiceData.order?.duration || '-'}</div>
            <div class="card"><strong>Amount Paid</strong><br/>₹${invoiceData.invoice?.total?.toLocaleString('en-IN') || '0'}</div>
            <div class="card"><strong>Transaction ID</strong><br/>${invoiceData.payment?.razorpayPaymentId || 'N/A'}</div>
          </div>
          <p class="muted">Status: ${invoiceData.invoice?.status || '-'}</p>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              My <span className="gradient-text">Orders</span>
            </h1>
            <p className="text-slate-500">View your subscription history and active plans.</p>
          </div>
        </ScrollReveal>

        {orders.length === 0 ? (
          <ScrollReveal>
            <GlassCard className="p-12 text-center">
              <FiShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="font-display font-bold text-lg text-slate-700 mb-2">No Orders Yet</h3>
              <p className="text-slate-400 mb-6">You haven't purchased any plans yet.</p>
              <Link to="/plans" className="glass-btn glass-btn-primary">
                Browse Plans
              </Link>
            </GlassCard>
          </ScrollReveal>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <ScrollReveal key={order._id} delay={i * 0.05}>
                <GlassCard className="p-6" hover3D={false}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{order.plan?.icon || '📋'}</span>
                      <div>
                        <h3 className="font-display font-semibold text-slate-800">{order.plan?.name || 'Plan'}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400 capitalize">{order.duration}</span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${paymentStatusColors[order.paymentStatus]}`}>
                            {order.paymentStatus}
                          </span>
                          {order.personalTrainer && (
                            <>
                              <span className="text-xs text-slate-300">•</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-600 font-medium">
                                + Personal Trainer
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-bold text-lg text-slate-800">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400 justify-end">
                        <FiCalendar size={12} />
                        <span>
                          {new Date(order.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' → '}
                          {new Date(order.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {order.invoice && (
                        <button
                          onClick={() => openInvoice(order._id)}
                          className="mt-3 inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                        >
                          <FiFileText size={12} />
                          View Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        )}

        {invoiceLoading && (
          <GlassCard className="mt-6 p-6 text-center">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Loading invoice...</p>
          </GlassCard>
        )}

        {invoiceData && (
          <GlassCard className="mt-6 p-6 sm:p-8" hover3D={false}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-800">Invoice Details</h3>
                <p className="text-sm text-slate-500">Invoice #{invoiceData.invoice?.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setInvoiceData(null)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center text-slate-500 hover:text-slate-700"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Plan</p>
                <p className="text-sm font-semibold text-slate-700">{invoiceData.order?.plan?.name}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Duration</p>
                <p className="text-sm font-semibold text-slate-700 capitalize">{invoiceData.order?.duration}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Amount Paid</p>
                <p className="text-sm font-semibold text-slate-700">₹{invoiceData.invoice?.total?.toLocaleString('en-IN')}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Transaction ID</p>
                <p className="text-sm font-semibold text-slate-700 break-all">{invoiceData.payment?.razorpayPaymentId || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/40">
              <p className="text-xs text-slate-400">
                Issued on {new Date(invoiceData.invoice?.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={printInvoice} className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-600 font-medium hover:bg-primary-100">
                  Print / Download
                </button>
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  {invoiceData.invoice?.status}
                </span>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
