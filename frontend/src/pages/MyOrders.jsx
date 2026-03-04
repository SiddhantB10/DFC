import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import { FiCalendar, FiShoppingBag } from 'react-icons/fi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
