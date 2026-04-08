import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingItemId, setProcessingItemId] = useState('');

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/cart');
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (error) {
      toast.error('Unable to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.amount || 0), 0),
    [items]
  );

  const removeItem = async (itemId) => {
    try {
      await API.delete(`/cart/${itemId}`);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Unable to remove item');
    }
  };

  const proceedToCheckout = async (item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!window.Razorpay) {
      toast.error('Payment SDK failed to load. Please refresh and try again.');
      return;
    }

    setProcessingItemId(item._id);

    try {
        // Determine checkout payload based on item type
        let checkoutPayload = {};
        if (item.type === 'plan') {
          checkoutPayload = {
            planId: item.plan._id,
            duration: item.duration,
            personalTrainer: item.personalTrainer
          };
        } else if (item.type === 'product') {
          checkoutPayload = {
            productId: item.product._id,
            quantity: item.quantity,
            color: item.color,
            size: item.size
          };
        } else {
          throw new Error('Unknown item type');
        }


        const checkoutRes = await API.post('/orders/checkout', checkoutPayload);
      const data = checkoutRes.data;
      if (!data.success) {
        throw new Error('Unable to create payment order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'DFC: Health & Harmony',
        description: item.type === 'plan'
          ? `${item.plan?.name || 'Plan'} (${item.duration})`
          : `${item.product?.name || 'Product'} x ${item.quantity}`,
        order_id: data.razorpayOrder.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#0ea5e9'
        },
        modal: {
          ondismiss: async () => {
            try {
              await API.post('/orders/payment-cancelled', {
                orderId: data.orderId,
                razorpay_order_id: data.razorpayOrder.id
              });
            } catch (cancelErr) {
              console.error('Payment cancel update failed:', cancelErr);
            }
            toast.error('Payment cancelled. You can retry anytime.');
          }
        },
        handler: async (response) => {
          try {
            const verifyRes = await API.post('/orders/verify-payment', {
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              await API.delete(`/cart/${item._id}`);
              setItems((prev) => prev.filter((x) => x._id !== item._id));
              toast.success('Payment successful. Subscription activated and invoice generated.');
              navigate('/my-orders');
            }
          } catch (verifyErr) {
            toast.error(verifyErr.response?.data?.message || 'Payment verification failed');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', async (response) => {
        try {
          await API.post('/orders/payment-failed', {
            orderId: data.orderId,
            razorpay_order_id: data.razorpayOrder.id,
            error: response.error
          });
        } catch (failedErr) {
          console.error('Payment failed update error:', failedErr);
        }
        toast.error(response.error?.description || 'Payment failed. Please try again.');
      });

      razorpayInstance.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing order');
    } finally {
      setProcessingItemId('');
    }
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
              My <span className="gradient-text">Cart</span>
            </h1>
            <p className="text-slate-500">Review your selected plans before payment.</p>
          </div>
        </ScrollReveal>

        {items.length === 0 ? (
          <ScrollReveal>
            <GlassCard className="p-12 text-center">
              <FiShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="font-display font-bold text-lg text-slate-700 mb-2">Your cart is empty</h3>
              <p className="text-slate-400 mb-6">Add plans or products to cart and continue to checkout.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link to="/plans" className="glass-btn glass-btn-primary">
                  Browse Plans
                </Link>
                <Link to="/store" className="glass-btn glass-btn-secondary">
                  Browse Store
                </Link>
              </div>
            </GlassCard>
          </ScrollReveal>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, i) => (
                <ScrollReveal key={item._id} delay={i * 0.05}>
                  <GlassCard className="p-6" hover3D={false}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">
                          {item.type === 'plan' ? (item.plan?.icon || '📋') : '🛍️'}
                        </span>
                        <div>
                          <h3 className="font-display font-semibold text-slate-800">
                            {item.type === 'plan' ? (item.plan?.name || 'Plan') : (item.product?.name || 'Product')}
                          </h3>
                          {item.type === 'plan' ? (
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                              <span className="capitalize">{item.duration}</span>
                              <span>•</span>
                              <span>{item.personalTrainer ? 'With Personal Trainer' : 'Without Personal Trainer'}</span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                              <span>Qty: {item.quantity}</span>
                              {item.color && (<><span>•</span><span>Color: {item.color}</span></>)}
                              {item.size && (<><span>•</span><span>Size: {item.size}</span></>)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-display font-bold text-lg text-slate-800">₹{(item.amount || 0).toLocaleString('en-IN')}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => removeItem(item._id)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center gap-1"
                          >
                            <FiTrash2 size={12} /> Remove
                          </button>
                          <button
                            onClick={() => proceedToCheckout(item)}
                            disabled={processingItemId === item._id}
                            className="px-3 py-1.5 text-xs rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 inline-flex items-center gap-1 disabled:opacity-60"
                          >
                            {processingItemId === item._id ? 'Processing...' : 'Checkout'} <FiArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <GlassCard className="p-6 mt-6" hover3D={false}>
                <div className="flex items-center justify-between">
                  <p className="text-slate-500">Cart Subtotal</p>
                  <p className="font-display font-bold text-2xl text-slate-800">₹{subtotal.toLocaleString('en-IN')}</p>
                </div>
              </GlassCard>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
