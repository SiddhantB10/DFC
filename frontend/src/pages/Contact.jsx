import { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import toast from 'react-hot-toast';
import { FiSend, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import GlassSelect from '../components/GlassSelect';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return toast.error('Please fill in all required fields');
    }
    setLoading(true);
    try {
      const { data } = await API.post('/contact', formData);
      if (data.success) {
        toast.success(data.message);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-primary-600 mb-4">
              Get In Touch
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Have questions or need help? Reach out to us through any of these channels. We're here to help!
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: FiMapPin, title: 'Visit Us', info: 'Mumbai, Maharashtra, India', color: 'from-primary-400 to-primary-600' },
              { icon: FiPhone, title: 'Call Us', info: '+91 99999 99999', color: 'from-secondary-400 to-secondary-600' },
              { icon: FiMail, title: 'Email Us', info: 'hello@dfchealth.com', color: 'from-accent-400 to-accent-600' },
              { icon: FiClock, title: 'Working Hours', info: 'Mon - Sat: 6 AM - 10 PM', color: 'from-pink-400 to-pink-600' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <GlassCard className="p-5" hover3D={false}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.info}</p>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={0.4}>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <GlassCard className="p-5 hover:bg-green-50/30 cursor-pointer" hover3D={false}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white flex-shrink-0">
                      <FaWhatsapp size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">WhatsApp</p>
                      <p className="text-sm text-green-500">Chat with us instantly</p>
                    </div>
                  </div>
                </GlassCard>
              </a>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={0.2}>
              <GlassCard className="p-8 sm:p-10">
                <h2 className="font-display font-bold text-xl text-slate-800 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className="glass-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="glass-input" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone number" className="glass-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Subject *</label>
                      <GlassSelect
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Select a subject"
                        options={[
                          { value: 'General Inquiry', label: 'General Inquiry' },
                          { value: 'Plan Information', label: 'Plan Information' },
                          { value: 'Technical Support', label: 'Technical Support' },
                          { value: 'Billing', label: 'Billing' },
                          { value: 'Feedback', label: 'Feedback' },
                          { value: 'Partnership', label: 'Partnership' },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Message *</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      className="glass-input resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="glass-btn glass-btn-primary !py-4 !px-8 gap-2 disabled:opacity-60">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSend size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
