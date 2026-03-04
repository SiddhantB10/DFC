import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import { FiTarget, FiHeart, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import { FaDumbbell, FaLeaf, FaAppleAlt, FaWhatsapp } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10">
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-primary-600 mb-4">
              About DFC
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
              Your Partner in <span className="gradient-text">Health & Harmony</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              DFC: Health & Harmony is a personalized wellness platform that brings together expert fitness guidance,
              holistic yoga practices, and scientific nutrition planning — all accessible through your phone with
              dedicated WhatsApp support.
            </p>
          </div>
        </ScrollReveal>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <ScrollReveal>
            <GlassCard className="p-8 sm:p-10 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-6">
                <FiTarget size={24} />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
              <p className="text-slate-500 leading-relaxed">
                To make personalized fitness and wellness accessible to everyone. We believe that professional
                health guidance should not be a luxury — it should be available to anyone who wants to transform
                their life, regardless of where they are.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <GlassCard className="p-8 sm:p-10 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white mb-6">
                <FiHeart size={24} />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">Our Vision</h2>
              <p className="text-slate-500 leading-relaxed">
                To create a world where everyone has the tools and support to achieve their optimal health.
                We envision a community where fitness is personalized, accessible, and guided by experts
                who truly care about your progress.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* What We Offer */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              What We <span className="gradient-text">Offer</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              A comprehensive approach to health covering all aspects of your wellness journey.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: FaDumbbell,
              title: 'Gym Workouts',
              desc: 'Customized workout plans with progressive overload, video demonstrations, and weekly adjustments.',
              color: 'from-primary-400 to-primary-600',
            },
            {
              icon: FaLeaf,
              title: 'Yoga Sessions',
              desc: 'From beginner to advanced — personalized yoga flows, meditation, and pranayama practices.',
              color: 'from-secondary-400 to-secondary-600',
            },
            {
              icon: FaAppleAlt,
              title: 'Diet Plans',
              desc: 'Scientifically designed meal plans respecting your preferences, culture, and nutritional needs.',
              color: 'from-accent-400 to-accent-600',
            },
            {
              icon: FaWhatsapp,
              title: 'WhatsApp Support',
              desc: 'Personal guidance from certified coaches delivered right to your WhatsApp for convenient access.',
              color: 'from-green-400 to-green-600',
            },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="p-6 h-full text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-5`}>
                  <item.icon size={24} />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Team */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Meet Our <span className="gradient-text">Experts</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { name: 'Arjun Mehta', role: 'Head Fitness Coach', specialty: 'Strength & Conditioning', emoji: '💪' },
            { name: 'Sneha Iyer', role: 'Senior Yoga Instructor', specialty: 'Hatha & Vinyasa Yoga', emoji: '🧘' },
            { name: 'Dr. Kavita Rao', role: 'Chief Nutritionist', specialty: 'Sports Nutrition', emoji: '🥗' },
          ].map((person, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4 text-4xl">
                  {person.emoji}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800">{person.name}</h3>
                <p className="text-sm text-primary-600 font-medium mb-1">{person.role}</p>
                <p className="text-xs text-slate-400">{person.specialty}</p>
                <div className="flex justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className="text-amber-400 fill-amber-400" size={12} />
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal>
          <GlassCard className="p-10 sm:p-16 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Ready to Begin Your <span className="gradient-text">Journey?</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-8">
              Join our community and get personalized plans that work for you.
            </p>
            <Link to="/register" className="glass-btn glass-btn-primary text-base !py-4 !px-10 group">
              Get Started Now
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default About;
