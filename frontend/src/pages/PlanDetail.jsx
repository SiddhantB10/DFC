import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import toast from 'react-hot-toast';
import { FiCheck, FiArrowRight, FiShield, FiClock, FiUsers } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const PlanDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState('monthly');
  const [personalTrainer, setPersonalTrainer] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await API.get(`/plans/${slug}`);
        if (data.success) setPlan(data.plan);
      } catch (err) {
        toast.error('Plan not found');
        navigate('/plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [slug]);

  const monthsMap = { monthly: 1, quarterly: 3, halfYearly: 6, yearly: 12 };

  const planPrice = plan?.pricing?.[duration] || 0;
  const trainerPrice = personalTrainer ? (plan?.personalTrainerPrice || 0) * (monthsMap[duration] || 1) : 0;
  const totalPrice = planPrice + trainerPrice;

  const durationLabels = {
    monthly: 'Monthly (1 Month)',
    quarterly: 'Quarterly (3 Months)',
    halfYearly: 'Half Yearly (6 Months)',
    yearly: 'Yearly (12 Months)',
  };

  const handleOrder = async () => {
    if (!user) {
      toast.error('Please login to purchase a plan');
      navigate('/login');
      return;
    }

    if (!window.Razorpay) {
      toast.error('Payment SDK failed to load. Please refresh and try again.');
      return;
    }

    setOrdering(true);
    try {
      const { data } = await API.post('/orders/checkout', {
        planId: plan._id,
        duration,
        personalTrainer,
      });

      if (!data.success) {
        throw new Error('Unable to create payment order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'DFC: Health & Harmony',
        description: `${plan.name} (${durationLabels[duration]})`,
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
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-8"><div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" /></div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Details */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <GlassCard className="p-8 sm:p-10 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">{plan.icon}</span>
                  <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800">{plan.name}</h1>
                    <span className="inline-block px-3 py-1 rounded-full glass text-xs font-medium text-primary-600 capitalize mt-1">
                      {plan.category}
                    </span>
                    {plan.isPopular && (
                      <span className="ml-2 inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-slate-500 leading-relaxed mb-8">{plan.description}</p>

                {/* Highlights */}
                {plan.highlights?.length > 0 && (
                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {plan.highlights.map((h, i) => (
                      <div key={i} className="glass rounded-2xl p-5 text-center">
                        <h4 className="font-display font-bold text-slate-800 mb-1">{h.title}</h4>
                        <p className="text-xs text-slate-500">{h.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Features */}
                <h3 className="font-display font-bold text-lg text-slate-800 mb-4">What's Included</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {plan.features?.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <FiCheck className="text-primary-500 mt-0.5 flex-shrink-0" size={16} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>

            {/* Trust Badges */}
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: FiShield, title: 'Secure', desc: 'Your data is safe' },
                  { icon: FiClock, title: 'Flexible', desc: 'Cancel anytime' },
                  { icon: FiUsers, title: 'Support', desc: '24/7 WhatsApp' },
                ].map((item, i) => (
                  <GlassCard key={i} className="p-4 text-center" hover3D={false}>
                    <item.icon className="mx-auto mb-2 text-primary-500" size={24} />
                    <p className="font-semibold text-sm text-slate-700">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Pricing Sidebar */}
          <div>
            <ScrollReveal delay={0.1}>
              <div className="lg:sticky lg:top-28">
                <GlassCard className="p-6 sm:p-8">
                  <h3 className="font-display font-bold text-lg text-slate-800 mb-6">Select Your Plan</h3>

                  {/* Duration Select */}
                  <div className="space-y-2 mb-6">
                    {Object.entries(durationLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setDuration(key)}
                        className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl transition-all duration-300 text-left ${
                          duration === key
                            ? 'bg-primary-50/80 border-2 border-primary-400/50 shadow-sm'
                            : 'glass border-2 border-transparent hover:border-white/40'
                        }`}
                      >
                        <div>
                          <p className={`text-sm font-medium ${duration === key ? 'text-primary-700' : 'text-slate-600'}`}>
                            {label}
                          </p>
                          {key === 'yearly' && (
                            <p className="text-[10px] text-primary-500 font-medium">Best Value - Save 30%</p>
                          )}
                        </div>
                        <p className={`font-display font-bold ${duration === key ? 'text-primary-700' : 'text-slate-700'}`}>
                          ₹{plan.pricing?.[key]?.toLocaleString('en-IN')}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Personal Trainer Toggle */}
                  {plan.personalTrainerAvailable && (
                    <div className="mb-6">
                      <button
                        onClick={() => setPersonalTrainer(!personalTrainer)}
                        className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl transition-all duration-500 ${
                          personalTrainer
                            ? 'bg-secondary-50/80 border-2 border-secondary-400/50'
                            : 'glass border-2 border-transparent hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            personalTrainer ? 'bg-secondary-500 border-secondary-500' : 'border-slate-300'
                          }`}>
                            {personalTrainer && <FiCheck className="text-white" size={12} />}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-slate-700">Add Personal Trainer</p>
                            <p className="text-[10px] text-slate-400">₹{plan.personalTrainerPrice?.toLocaleString('en-IN')}/month</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-secondary-600">
                          +₹{trainerPrice.toLocaleString('en-IN')}
                        </p>
                      </button>
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="glass rounded-2xl p-5 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Plan Price</span>
                      <span className="text-slate-700">₹{planPrice.toLocaleString('en-IN')}</span>
                    </div>
                    {trainerPrice > 0 && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500">Personal Trainer</span>
                        <span className="text-slate-700">₹{trainerPrice.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="border-t border-white/30 mt-3 pt-3 flex justify-between">
                      <span className="font-semibold text-slate-800">Total</span>
                      <span className="font-display font-bold text-xl gradient-text-primary">
                        ₹{totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="glass-btn glass-btn-primary w-full !py-4 text-base group disabled:opacity-60"
                  >
                    {ordering ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Buy Now
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                    <FaWhatsapp className="text-green-500" size={14} />
                    <span>WhatsApp guidance included with all plans</span>
                  </div>
                </GlassCard>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
