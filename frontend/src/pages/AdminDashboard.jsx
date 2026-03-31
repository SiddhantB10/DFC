import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashResult, reportResult, plansResult, usersResult] = await Promise.allSettled([
        API.get('/admin/dashboard'),
        API.get('/admin/reports/sales'),
        API.get('/plans'),
        API.get('/admin/users')
      ]);

      if (dashResult.status === 'fulfilled' && dashResult.value.data.success) {
        setData(dashResult.value.data);
      }

      if (reportResult.status === 'fulfilled' && reportResult.value.data.success) {
        setReport(reportResult.value.data);
      }

      if (plansResult.status === 'fulfilled' && plansResult.value.data.success) {
        setPlans(plansResult.value.data.plans || []);
      }

      if (usersResult.status === 'fulfilled' && usersResult.value.data.success) {
        setUsers(usersResult.value.data.users || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const markContactStatus = async (contactId, status) => {
    try {
      await API.put(`/admin/contacts/${contactId}/status`, { status });
      toast.success('Contact status updated');
      fetchDashboard();
    } catch (error) {
      toast.error('Unable to update contact status');
    }
  };

  const updatePlanSlots = async (planId, field, delta) => {
    const current = plans.find((p) => p._id === planId);
    if (!current) return;
    const nextValue = Math.max(0, Number(current[field] || 0) + delta);

    try {
      await API.put(`/plans/${planId}`, { [field]: nextValue });
      setPlans((prev) => prev.map((plan) => (plan._id === planId ? { ...plan, [field]: nextValue } : plan)));
      toast.success('Inventory updated');
    } catch (error) {
      toast.error('Unable to update inventory');
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
      <div className="container-custom relative z-10">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-500">Monitor users, orders, sales, and support activity.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Users', value: data?.summary?.totalUsers || 0 },
            { label: 'Orders', value: data?.summary?.totalOrders || 0 },
            { label: 'Active Subs', value: data?.summary?.activeSubscriptions || 0 },
            { label: 'Revenue', value: `₹${(data?.summary?.totalRevenue || 0).toLocaleString('en-IN')}` }
          ].map((item, idx) => (
            <ScrollReveal key={item.label} delay={idx * 0.05}>
              <GlassCard className="p-5" hover3D={false}>
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="font-display font-bold text-2xl text-slate-800">{item.value}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal>
              <GlassCard className="p-6" hover3D={false}>
                <h2 className="font-display font-bold text-xl text-slate-800 mb-4">Recent Orders</h2>
                <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                  {data?.recentOrders?.map((order) => (
                    <div key={order._id} className="flex justify-between items-center gap-3 p-3 rounded-xl glass">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{order.user?.name || 'User'} • {order.plan?.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{order.duration} • {order.paymentStatus} • {order.status}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal>
              <GlassCard className="p-6" hover3D={false}>
                <h2 className="font-display font-bold text-xl text-slate-800 mb-4">Users & Engagement</h2>
                <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                  {users.length === 0 && <p className="text-sm text-slate-400">No users found.</p>}
                  {users.slice(0, 20).map((user) => (
                    <div key={user._id} className="flex items-center justify-between gap-3 p-3 rounded-xl glass">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 capitalize">{user.fitnessLevel}</p>
                        <p className="text-[10px] text-slate-400">{new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal>
              <GlassCard className="p-6" hover3D={false}>
                <h2 className="font-display font-bold text-xl text-slate-800 mb-4">Sales Report</h2>
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-slate-400">Paid Orders</p>
                    <p className="font-display font-bold text-xl text-slate-800">{report?.summary?.orders || 0}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-slate-400">Revenue</p>
                    <p className="font-display font-bold text-xl text-slate-800">₹{(report?.summary?.revenue || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-slate-400">Avg Order</p>
                    <p className="font-display font-bold text-xl text-slate-800">₹{Math.round(report?.summary?.avgOrderValue || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">By Duration</p>
                    <div className="space-y-2">
                      {report?.byDuration?.map((row) => (
                        <div key={row._id} className="flex items-center justify-between text-sm glass rounded-lg px-3 py-2">
                          <span className="capitalize text-slate-600">{row._id}</span>
                          <span className="text-slate-800 font-semibold">₹{row.revenue.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">By Plan</p>
                    <div className="space-y-2 max-h-44 overflow-auto pr-1">
                      {report?.byPlan?.map((row) => (
                        <div key={row._id} className="flex items-center justify-between text-sm glass rounded-lg px-3 py-2">
                          <span className="text-slate-600 truncate">{row._id}</span>
                          <span className="text-slate-800 font-semibold">₹{row.revenue.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal>
              <GlassCard className="p-6" hover3D={false}>
                <h2 className="font-display font-bold text-xl text-slate-800 mb-4">Support Inbox</h2>
                <div className="space-y-3 max-h-[620px] overflow-auto pr-1">
                  {(data?.summary?.totalContacts || 0) === 0 && (
                    <p className="text-sm text-slate-400">No support messages yet.</p>
                  )}
                  {data?.recentContacts?.map((contact) => (
                    <div key={contact._id} className="glass rounded-xl p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-700 truncate">{contact.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 uppercase">{contact.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{contact.email}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{contact.subject}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => markContactStatus(contact._id, 'read')} className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">Mark Read</button>
                        <button onClick={() => markContactStatus(contact._id, 'replied')} className="text-[10px] px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">Mark Replied</button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal>
              <GlassCard className="p-6 mt-6" hover3D={false}>
                <h2 className="font-display font-bold text-xl text-slate-800 mb-4">Inventory & Trainer Slots</h2>
                <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                  {plans.map((plan) => (
                    <div key={plan._id} className="glass rounded-xl p-3">
                      <p className="text-sm font-semibold text-slate-700 mb-2">{plan.name}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-slate-500">
                          Service Slots
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => updatePlanSlots(plan._id, 'availableSlots', -1)} className="px-2 py-1 rounded bg-slate-100">-</button>
                            <span className="font-semibold text-slate-800">{plan.availableSlots}</span>
                            <button onClick={() => updatePlanSlots(plan._id, 'availableSlots', 1)} className="px-2 py-1 rounded bg-slate-100">+</button>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          Trainer Slots
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => updatePlanSlots(plan._id, 'trainerSlots', -1)} className="px-2 py-1 rounded bg-slate-100">-</button>
                            <span className="font-semibold text-slate-800">{plan.trainerSlots}</span>
                            <button onClick={() => updatePlanSlots(plan._id, 'trainerSlots', 1)} className="px-2 py-1 rounded bg-slate-100">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
