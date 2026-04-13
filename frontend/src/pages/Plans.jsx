import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import API from '../api/axios';
import PlanCard from '../components/PlanCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState('monthly');
  const [searchText, setSearchText] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (activeCategory !== 'all') query.set('category', activeCategory);
        if (searchText.trim()) query.set('q', searchText.trim());
        if (minPrice) query.set('minPrice', minPrice);
        if (maxPrice) query.set('maxPrice', maxPrice);
        if (minRating) query.set('minRating', minRating);
        query.set('duration', duration);

        const qs = query.toString();
        const { data } = await API.get(`/plans${qs ? `?${qs}` : ''}`);
        if (data.success) setPlans(data.plans);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [activeCategory, searchText, minPrice, maxPrice, minRating, duration]);

  const categories = [
    { key: 'all', label: 'All Plans', icon: '🎯' },
    { key: 'gym', label: 'Gym', icon: '🏋️' },
    { key: 'yoga', label: 'Yoga', icon: '🧘' },
    { key: 'diet', label: 'Diet', icon: '🥗' },
    { key: 'combo', label: 'Combo', icon: '💪' },
    { key: 'complete', label: 'Complete', icon: '⭐' },
  ];

  const durations = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'halfYearly', label: '6 Months' },
    { key: 'yearly', label: 'Yearly', badge: 'Save 30%' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-primary-600 mb-4">
              Flexible Plans
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
              Find Your <span className="gradient-text">Perfect Plan</span>
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Choose from our range of personalized fitness plans. All plans include WhatsApp guidance from certified professionals.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card p-4 sm:p-5 mb-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search plans"
                className="glass-input"
              />
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min price"
                className="glass-input"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price"
                className="glass-input"
              />
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="glass-input"
              >
                <option value="">Any rating</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="4.8">4.8+</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal>
          <div className="flex justify-center mb-6">
            <LayoutGroup id="categories">
              <div className="glass-card inline-flex p-1.5 gap-1 flex-wrap justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSearchParams(cat.key === 'all' ? {} : { category: cat.key })}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 flex items-center gap-1.5 ${
                      activeCategory === cat.key
                        ? 'text-slate-800'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {activeCategory === cat.key && (
                      <motion.div
                        layoutId="activeCategoryBg"
                        className="absolute inset-0 rounded-xl bg-white/70 shadow-lg shadow-black/5"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span>{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>
        </ScrollReveal>

        {/* Duration Toggle */}
        <ScrollReveal>
          <div className="flex justify-center mb-12">
            <LayoutGroup id="durations">
              <div className="glass-card inline-flex flex-wrap justify-center p-1.5 gap-1" style={{ background: 'rgba(255,255,255,0.18)' }}>
                {durations.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDuration(d.key)}
                    className={`relative px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                      duration === d.key
                        ? 'text-slate-800'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {duration === d.key && (
                      <motion.div
                        layoutId="activeDurationBg"
                        className="absolute inset-0 rounded-xl bg-white/70 shadow-lg shadow-black/5"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span className="relative z-10">{d.label}</span>
                    {d.badge && (
                      <span className="relative z-10 ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">{d.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>
        </ScrollReveal>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 items-stretch">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-8 h-96 shimmer rounded-3xl" />
            ))}
          </div>
        ) : plans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 items-stretch">
            {plans.map((plan, i) => (
              <PlanCard key={plan._id} plan={plan} duration={duration} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass-card inline-block p-10">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-slate-500">No plans found for this category.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
