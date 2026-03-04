import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import CountUp from 'react-countup';
import { FiArrowRight, FiCheck, FiStar, FiUsers, FiAward, FiActivity } from 'react-icons/fi';
import { FaWhatsapp, FaDumbbell, FaLeaf, FaAppleAlt } from 'react-icons/fa';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import PlanCard from '../components/PlanCard';
import API from '../api/axios';

/* Shared smooth ease */
const smoothEase = [0.16, 1, 0.3, 1];

/* Stagger container */
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: smoothEase } },
};

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [duration, setDuration] = useState('monthly');
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await API.get('/plans');
        if (data.success) setPlans(data.plans);
      } catch (err) { /* silent */ }
    };
    fetchPlans();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center pt-20">
        <FloatingShapes />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-medium text-primary-700 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                Your Personalized Fitness Journey Starts Here
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6"
              >
                <span className="text-slate-800">Transform</span>
                <br />
                <span className="gradient-text">Your Body</span>
                <br />
                <span className="text-slate-800">& Mind</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg"
              >
                Get personalized gym workouts, yoga routines, and diet plans crafted by experts.
                Guided personally through WhatsApp by dedicated trainers.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
                <Link to="/plans" className="glass-btn glass-btn-primary text-base !py-4 !px-8 group">
                  Explore Plans
                  <FiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-500" size={18} />
                </Link>
                <Link to="/about" className="glass-btn glass-btn-secondary text-base !py-4 !px-8">
                  Learn More
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['bg-primary-400', 'bg-secondary-400', 'bg-accent-400', 'bg-pink-400'].map((bg, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span>500+ Active Members</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="text-amber-400 fill-amber-400" size={14} />
                  ))}
                  <span className="ml-1">4.9/5</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Liquid Glass Hero Cards */}
            <motion.div
              style={{ y: heroParallax }}
              initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[550px]">
                {/* Main Card - smooth float */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 left-4 right-4"
                >
                  <div className="glass-card p-8" style={{ background: 'rgba(255,255,255,0.28)' }}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <FaDumbbell size={24} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-800">Gym Workout</h3>
                        <p className="text-xs text-slate-400">Personalized Training</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      {['Push-Pull-Legs Split', 'Progressive Overload', 'Video Demonstrations'].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.12, duration: 0.5, ease: smoothEase }}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <FiCheck className="text-primary-500" size={14} />
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, delay: 1.2, ease: smoothEase }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Progress: 75% of monthly goal</p>
                  </div>
                </motion.div>

                {/* Floating WhatsApp Card */}
                <motion.div
                  animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-24 -left-4"
                >
                  <div className="glass-card p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.32)' }}>
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md shadow-green-500/20">
                      <FaWhatsapp size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">WhatsApp Coach</p>
                      <p className="text-[11px] text-green-500 font-medium">Online • Ready to guide</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Stats Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-8 right-0"
                >
                  <div className="glass-card p-5" style={{ background: 'rgba(255,255,255,0.30)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <FiActivity className="text-secondary-500" size={18} />
                      <span className="text-sm font-semibold text-slate-700">Weekly Report</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">5</p>
                        <p className="text-[10px] text-slate-400">Workouts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-secondary-600">12k</p>
                        <p className="text-[10px] text-slate-400">Calories</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent-500">0.5</p>
                        <p className="text-[10px] text-slate-400">Kg Lost</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="section-padding relative">
        <div className="container-custom">
          <ScrollReveal>
            <div className="glass-card p-8 sm:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: 500, suffix: '+', label: 'Active Members', icon: FiUsers, color: 'text-primary-500' },
                  { value: 50, suffix: '+', label: 'Expert Trainers', icon: FiAward, color: 'text-secondary-500' },
                  { value: 15, suffix: '+', label: 'Programs Offered', icon: FiActivity, color: 'text-accent-500' },
                  { value: 98, suffix: '%', label: 'Success Rate', icon: FiStar, color: 'text-pink-500' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <stat.icon className={`mx-auto mb-3 ${stat.color}`} size={28} />
                    <p className="text-3xl sm:text-4xl font-display font-bold text-slate-800">
                      <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyOnce />
                      {stat.suffix}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="section-padding relative">
        <FloatingShapes />
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-primary-600 mb-4">
                Why Choose DFC
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                Everything You Need for
                <span className="gradient-text"> Your Fitness</span>
              </h2>
              <p className="text-slate-500 leading-relaxed">
                A complete ecosystem designed to support every aspect of your health and wellness journey.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FaDumbbell,
                title: 'Personalized Workouts',
                description: 'Custom gym routines based on your fitness level, goals, and available equipment. Updated weekly for continuous progress.',
                color: 'from-primary-400 to-primary-600',
                shadowColor: 'shadow-primary-500/20',
              },
              {
                icon: FaLeaf,
                title: 'Yoga & Mindfulness',
                description: 'Holistic yoga programs with guided meditation and breathing exercises for complete mind-body wellness.',
                color: 'from-secondary-400 to-secondary-600',
                shadowColor: 'shadow-secondary-500/20',
              },
              {
                icon: FaAppleAlt,
                title: 'Nutrition Planning',
                description: 'Scientifically crafted diet plans considering your preferences, allergies, and fitness goals.',
                color: 'from-accent-400 to-accent-600',
                shadowColor: 'shadow-accent-500/20',
              },
              {
                icon: FaWhatsapp,
                title: 'WhatsApp Guidance',
                description: 'Personal guidance from dedicated coaches right on WhatsApp. Get instant answers and daily motivation.',
                color: 'from-green-400 to-green-600',
                shadowColor: 'shadow-green-500/20',
              },
              {
                icon: FiUsers,
                title: 'Personal Trainers',
                description: 'Upgrade to get a 1-on-1 certified personal trainer who crafts and adjusts your plans in real-time.',
                color: 'from-pink-400 to-pink-600',
                shadowColor: 'shadow-pink-500/20',
              },
              {
                icon: FiActivity,
                title: 'Progress Tracking',
                description: 'Track your fitness metrics, body measurements, and workout performance to stay motivated.',
                color: 'from-cyan-400 to-cyan-600',
                shadowColor: 'shadow-cyan-500/20',
              },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <GlassCard hover3D={false} className="p-6 sm:p-8 h-full" glowColor={`rgba(20, 184, 166, 0.06)`} intensity={4}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg ${feature.shadowColor} mb-5`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section-padding relative">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-secondary-600 mb-4">
                Simple Process
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                How It<span className="gradient-text"> Works</span>
              </h2>
              <p className="text-slate-500">Get started in just 4 simple steps</p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your profile with your fitness details — age, height, weight, and goal weight.' },
              { step: '02', title: 'Choose a Plan', desc: 'Select from our range of gym, yoga, diet, or combo plans with flexible durations.' },
              { step: '03', title: 'Get Connected', desc: 'Get connected with your personal coach on WhatsApp for guided support.' },
              { step: '04', title: 'Transform', desc: 'Follow your personalized plan and watch your transformation unfold day by day.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.10}>
                <GlassCard hover3D={false} className="p-6 text-center h-full" intensity={3}>
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-display font-bold gradient-text">{item.step}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PLANS PREVIEW ============ */}
      <section className="section-padding relative">
        <FloatingShapes />
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-accent-600 mb-4">
                Our Plans
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                Choose Your<span className="gradient-text"> Perfect Plan</span>
              </h2>
              <p className="text-slate-500">Flexible plans designed to fit your lifestyle and goals</p>
            </div>
          </ScrollReveal>

          {/* Duration Toggle */}
          <ScrollReveal>
            <div className="flex justify-center mb-12">
              <div className="glass-card inline-flex p-1.5 gap-1" style={{ background: 'rgba(255,255,255,0.18)' }}>
                {[
                  { key: 'monthly', label: 'Monthly' },
                  { key: 'quarterly', label: 'Quarterly' },
                  { key: 'halfYearly', label: '6 Months' },
                  { key: 'yearly', label: 'Yearly' },
                ].map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDuration(d.key)}
                    className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 ease-out relative ${
                      duration === d.key
                        ? 'bg-white/70 text-slate-800 shadow-lg shadow-black/5'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/25'
                    }`}
                  >
                    {d.label}
                    {d.key === 'yearly' && (
                      <span className="ml-1.5 text-[10px] bg-primary-500/10 text-primary-600 px-1.5 py-0.5 rounded-full font-bold">Save 30%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.slice(0, 3).map((plan, i) => (
              <PlanCard key={plan._id} plan={plan} duration={duration} index={i} />
            ))}
          </div>

          {plans.length > 3 && (
            <ScrollReveal>
              <div className="text-center mt-10">
                <Link to="/plans" className="glass-btn glass-btn-secondary group">
                  View All Plans
                  <FiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-500" />
                </Link>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section-padding relative">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-pink-600 mb-4">
                Success Stories
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
                What Our Members<span className="gradient-text"> Say</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                role: 'Lost 12kg in 6 months',
                text: 'The personalized diet plan combined with gym workouts has been life-changing. The WhatsApp support kept me motivated every day!',
                rating: 5,
              },
              {
                name: 'Rahul Patel',
                role: 'Gained 8kg muscle mass',
                text: 'Best decision I made for my fitness. The personal trainer on WhatsApp monitors my progress daily and adjusts my plan accordingly.',
                rating: 5,
              },
              {
                name: 'Ananya Reddy',
                role: 'Complete Transformation',
                text: 'The complete package with yoga + gym + diet is incredible. I feel more energetic, flexible, and confident than ever before.',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <ScrollReveal key={i} delay={i * 0.10}>
                <GlassCard hover3D={false} className="p-6 sm:p-8 h-full" intensity={3}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <FiStar key={j} className="text-amber-400 fill-amber-400" size={16} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{testimonial.name}</p>
                      <p className="text-xs text-primary-500">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="section-padding relative">
        <div className="container-custom">
          <ScrollReveal>
            <div className="glass-card p-10 sm:p-16 text-center relative overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.15), transparent 70%)', filter: 'blur(40px)' }} />
              <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', filter: 'blur(40px)' }} />

              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-5xl font-bold text-slate-800 mb-4">
                  Ready to Start Your
                  <br />
                  <span className="gradient-text">Transformation?</span>
                </h2>
                <p className="text-slate-500 max-w-lg mx-auto mb-8 leading-relaxed">
                  Join 500+ members who have already transformed their lives with DFC Health & Harmony.
                  Your personalized plan awaits.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/register" className="glass-btn glass-btn-primary text-base !py-4 !px-10 group">
                    Start Your Journey
                    <FiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-500" size={18} />
                  </Link>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn glass-btn-secondary text-base !py-4 !px-8"
                  >
                    <FaWhatsapp className="text-green-500" size={20} />
                    Chat with Us
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
