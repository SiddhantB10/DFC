import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import toast from 'react-hot-toast';
import { FiUser, FiSave, FiLock, FiActivity } from 'react-icons/fi';
import GlassSelect from '../components/GlassSelect';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    name: '', phone: '', age: '', gender: '',
    height: '', weight: '', goalWeight: '', fitnessLevel: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || '',
        height: user.height || '',
        weight: user.weight || '',
        goalWeight: user.goalWeight || '',
        fitnessLevel: user.fitnessLevel || 'beginner',
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        goalWeight: Number(formData.goalWeight),
      };
      const { data } = await API.put('/users/profile', payload);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setPasswordLoading(true);
    try {
      const { data } = await API.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        if (data.token) localStorage.setItem('dfc_token', data.token);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error changing password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10 max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20 text-white text-3xl font-display font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-800 mb-1">{user?.name}</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <div className="glass-card inline-flex flex-wrap justify-center p-1.5 gap-1">
              {[
                { key: 'profile', label: 'Profile', icon: FiUser },
                { key: 'fitness', label: 'Fitness', icon: FiActivity },
                { key: 'password', label: 'Password', icon: FiLock },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'text-slate-500'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <GlassCard className="p-8 sm:p-10">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="glass-input" maxLength={10} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Gender</label>
                    <GlassSelect
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      placeholder="Select"
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="glass-btn glass-btn-primary !py-3 gap-2 disabled:opacity-60">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={16} />}
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === 'fitness' && (
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Fitness Metrics</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Height (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} className="glass-input" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Current Weight (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Goal Weight (kg)</label>
                    <input type="number" name="goalWeight" value={formData.goalWeight} onChange={handleChange} className="glass-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Fitness Level</label>
                  <GlassSelect
                    name="fitnessLevel"
                    value={formData.fitnessLevel}
                    onChange={handleChange}
                    placeholder="Select level"
                    options={[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ]}
                  />
                </div>

                {Number(formData.height) > 0 && Number(formData.weight) > 0 && (
                  <div className="glass rounded-2xl p-5">
                    <p className="text-sm text-slate-500 mb-1">Your BMI</p>
                    <p className="text-3xl font-display font-bold gradient-text-primary">
                      {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}
                    </p>
                  </div>
                )}

                <button type="submit" disabled={loading} className="glass-btn glass-btn-primary !py-3 gap-2 disabled:opacity-60">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={16} />}
                  Update Metrics
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Change Password</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="glass-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="glass-input" placeholder="Min. 6 characters" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="glass-input" />
                </div>
                <button type="submit" disabled={passwordLoading} className="glass-btn glass-btn-accent !py-3 gap-2 disabled:opacity-60">
                  {passwordLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiLock size={16} />}
                  Change Password
                </button>
              </form>
            )}
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Profile;
