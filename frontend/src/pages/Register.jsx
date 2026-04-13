import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import FloatingShapes from '../components/FloatingShapes';
import Logo from '../components/Logo';
import GlassSelect from '../components/GlassSelect';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    age: '', gender: '', height: '', weight: '',
    goalWeight: '', fitnessLevel: 'beginner', referralCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error('Please fill in all fields');
      return false;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      toast.error('Password must be at least 8 characters and include uppercase and lowercase letters');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.age || !formData.gender || !formData.height || !formData.weight || !formData.goalWeight) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        goalWeight: Number(formData.goalWeight),
      };
      await register(payload);
      toast.success('Account created successfully! Welcome to DFC!');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-10 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-card p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4">
                <Logo size={64} className="rounded-2xl shadow-lg shadow-primary-500/20" />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">Create Account</h1>
              <p className="text-sm text-slate-500">
                {step === 1 ? 'Enter your basic details' : 'Tell us about your fitness'}
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step >= s
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                      : 'glass text-slate-400'
                  }`}>
                    {s}
                  </div>
                  {s === 1 && (
                    <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
                      step >= 2 ? 'bg-gradient-to-r from-primary-500 to-primary-400' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text" name="name" value={formData.name} onChange={handleChange}
                        placeholder="John Doe" className="glass-input !pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="you@example.com" className="glass-input !pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'} name="password"
                        value={formData.password} onChange={handleChange}
                        placeholder="Min. 8 chars with A-Z and a-z" className="glass-input !pl-11 !pr-11"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="10-digit number" className="glass-input !pl-11" maxLength={10}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Referral Code (Optional)</label>
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      placeholder="Enter referral code"
                      className="glass-input uppercase"
                    />
                  </div>

                  <button type="button" onClick={handleNext}
                    className="glass-btn glass-btn-primary w-full !py-4 text-base mt-2">
                    Continue
                  </button>
                </motion.div>
              )}

              {/* Step 2: Fitness Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Age</label>
                      <input
                        type="number" name="age" value={formData.age} onChange={handleChange}
                        placeholder="25" className="glass-input" min="14" max="100"
                      />
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

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Height (cm)</label>
                    <input
                      type="number" name="height" value={formData.height} onChange={handleChange}
                      placeholder="170" className="glass-input" min="100" max="250"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Current Weight (kg)</label>
                      <input
                        type="number" name="weight" value={formData.weight} onChange={handleChange}
                        placeholder="70" className="glass-input" min="30" max="300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Goal Weight (kg)</label>
                      <input
                        type="number" name="goalWeight" value={formData.goalWeight} onChange={handleChange}
                        placeholder="65" className="glass-input" min="30" max="200"
                      />
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

                  <div className="flex gap-3 mt-2">
                    <button type="button" onClick={() => setStep(1)}
                      className="glass-btn glass-btn-secondary flex-1 !py-4">
                      Back
                    </button>
                    <button type="submit" disabled={loading}
                      className="glass-btn glass-btn-primary flex-1 !py-4 disabled:opacity-60">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : 'Create Account'}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 link-underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
