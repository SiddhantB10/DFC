import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import { FiActivity, FiTarget, FiTrendingDown, FiTrendingUp, FiCalendar, FiAward, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          API.get('/users/stats'),
          API.get('/orders'),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const bmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const bmiInfo = stats ? bmiCategory(stats.bmi) : null;

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-slate-500">Here's an overview of your fitness journey.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {[
            {
              label: 'BMI',
              value: stats?.bmi || '—',
              sub: bmiInfo?.label || '',
              subColor: bmiInfo?.color || '',
              icon: FiActivity,
              iconBg: 'from-primary-400 to-primary-600',
            },
            {
              label: 'Current Weight',
              value: `${stats?.currentWeight || '—'} kg`,
              sub: `Goal: ${stats?.goalWeight || '—'} kg`,
              subColor: 'text-slate-400',
              icon: FiTarget,
              iconBg: 'from-secondary-400 to-secondary-600',
            },
            {
              label: 'Weight to Goal',
              value: `${stats?.weightToGoal || '—'} kg`,
              sub: stats?.direction === 'lose' ? 'To lose' : stats?.direction === 'gain' ? 'To gain' : 'Maintaining',
              subColor: stats?.direction === 'lose' ? 'text-amber-500' : 'text-green-500',
              icon: stats?.direction === 'lose' ? FiTrendingDown : FiTrendingUp,
              iconBg: 'from-accent-400 to-accent-600',
            },
            {
              label: 'Total Orders',
              value: stats?.totalOrders || 0,
              sub: 'Plans purchased',
              subColor: 'text-slate-400',
              icon: FiShoppingBag,
              iconBg: 'from-pink-400 to-pink-600',
            },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="p-5 sm:p-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center text-white mb-3`}>
                  <item.icon size={20} />
                </div>
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="text-2xl font-display font-bold text-slate-800">{item.value}</p>
                <p className={`text-xs mt-1 ${item.subColor}`}>{item.sub}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Subscription */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <GlassCard className="p-6 sm:p-8">
                <h2 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                  <FiAward className="text-primary-500" /> Active Subscription
                </h2>

                {stats?.activeSubscription ? (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{stats.activeSubscription.plan?.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-lg text-slate-800">
                          {stats.activeSubscription.plan?.name}
                        </h3>
                        <p className="text-sm text-slate-400 capitalize">{stats.activeSubscription.duration} Plan</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="glass rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Start Date</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(stats.activeSubscription.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="glass rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">End Date</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(stats.activeSubscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {stats.activeSubscription.plan?.features && (
                      <div className="space-y-2">
                        {stats.activeSubscription.plan.features.slice(0, 4).map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 mb-4">You don't have an active subscription yet.</p>
                    <Link to="/plans" className="glass-btn glass-btn-primary group">
                      Browse Plans <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </GlassCard>
            </ScrollReveal>
          </div>

          {/* Quick Actions */}
          <div>
            <ScrollReveal delay={0.2}>
              <GlassCard className="p-6 sm:p-8">
                <h2 className="font-display font-bold text-xl text-slate-800 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Link to="/plans" className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/40 transition-all duration-500 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
                      <FiShoppingBag size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Browse Plans</p>
                      <p className="text-xs text-slate-400">Find your perfect plan</p>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/40 transition-all duration-500 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white">
                      <FiTarget size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Update Profile</p>
                      <p className="text-xs text-slate-400">Update your fitness metrics</p>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/40 transition-all duration-500 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
                      <FaWhatsapp size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">WhatsApp Support</p>
                      <p className="text-xs text-slate-400">Chat with your coach</p>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <Link to="/my-orders" className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/40 transition-all duration-500 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white">
                      <FiCalendar size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Order History</p>
                      <p className="text-xs text-slate-400">View past subscriptions</p>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <ScrollReveal>
            <div className="mt-8">
              <GlassCard className="p-6 sm:p-8">
                <h2 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                  <FiCalendar className="text-secondary-500" /> Recent Orders
                </h2>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 rounded-xl glass">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{order.plan?.icon || '📋'}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{order.plan?.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{order.duration} • {order.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
