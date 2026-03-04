import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const PlanCard = ({ plan, duration = 'monthly', index = 0 }) => {
  const price = plan.pricing?.[duration] || 0;
  const durationLabels = {
    monthly: '/month',
    quarterly: '/quarter',
    halfYearly: '/6 months',
    yearly: '/year',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard
        hover3D={false}
        className={`p-6 sm:p-8 h-full flex flex-col relative ${
          plan.isPopular ? 'ring-2 ring-primary-400/30 ring-offset-0' : ''
        }`}
        glowColor={plan.color ? `${plan.color}15` : undefined}
        intensity={5}
      >
        {plan.isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <span className="badge-popular px-4 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-primary-500/20">
              Most Popular
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{plan.icon}</span>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800">{plan.name}</h3>
            <span className="text-xs font-medium text-slate-400 capitalize">{plan.category}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          {plan.shortDescription}
        </p>

        <div className="mb-6">
          <div className="flex items-end gap-1">
            <span className="text-sm text-slate-400">₹</span>
            <motion.span
              key={price}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-display font-bold gradient-text-primary"
            >
              {price.toLocaleString('en-IN')}
            </motion.span>
            <span className="text-sm text-slate-400 mb-1">{durationLabels[duration]}</span>
          </div>
          {plan.personalTrainerAvailable && (
            <p className="text-xs text-slate-400 mt-2">
              + ₹{plan.personalTrainerPrice?.toLocaleString('en-IN')}/mo for personal trainer
            </p>
          )}
        </div>

        <ul className="space-y-2.5 mb-8 flex-grow">
          {plan.features?.slice(0, 6).map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <FiCheck className="text-primary-500 mt-0.5 flex-shrink-0" size={16} />
              <span>{feature}</span>
            </li>
          ))}
          {plan.features?.length > 6 && (
            <li className="text-xs text-primary-500 font-medium pl-6">
              +{plan.features.length - 6} more features
            </li>
          )}
        </ul>

        <Link
          to={`/plans/${plan.slug}`}
          className="glass-btn glass-btn-primary w-full text-center group"
        >
          View Plan Details
          <FiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-500 ease-out-expo" />
        </Link>
      </GlassCard>
    </motion.div>
  );
};

export default PlanCard;
