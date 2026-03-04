import { Link } from 'react-router-dom';
import { FiHeart, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />

      <div className="glass-nav border-t-0">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <Logo size={40} className="rounded-xl" />
                <div>
                  <span className="font-display font-bold text-lg gradient-text">DFC</span>
                  <p className="text-[10px] text-slate-500 tracking-wider uppercase">Health & Harmony</p>
                </div>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Your personalized fitness partner. Transform your body and mind with expert-guided
                gym workouts, yoga sessions, and nutrition plans.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: FaWhatsapp, href: 'https://wa.me/919999999999', color: 'hover:text-green-500' },
                  { icon: FaInstagram, href: '#', color: 'hover:text-pink-500' },
                  { icon: FaTwitter, href: '#', color: 'hover:text-blue-400' },
                  { icon: FaYoutube, href: '#', color: 'hover:text-red-500' },
                ].map(({ icon: Icon, href, color }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 ${color} transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg`}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-slate-800 mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { to: '/plans', label: 'Our Plans' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/register', label: 'Get Started' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-primary-600 transition-colors link-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plans */}
            <div>
              <h4 className="font-display font-semibold text-slate-800 mb-4">Our Plans</h4>
              <ul className="space-y-3">
                {[
                  { to: '/plans?category=gym', label: 'Gym Workout' },
                  { to: '/plans?category=yoga', label: 'Yoga & Mindfulness' },
                  { to: '/plans?category=diet', label: 'Nutrition & Diet' },
                  { to: '/plans?category=combo', label: 'Gym + Diet Combo' },
                  { to: '/plans?category=complete', label: 'Complete Package' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-primary-600 transition-colors link-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-slate-800 mb-4">Get In Touch</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-primary-500 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-sm text-slate-500">Mumbai, Maharashtra, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone className="text-primary-500 flex-shrink-0" size={16} />
                  <span className="text-sm text-slate-500">+91 99999 99999</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail className="text-primary-500 flex-shrink-0" size={16} />
                  <span className="text-sm text-slate-500">hello@dfchealth.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaWhatsapp className="text-green-500 flex-shrink-0" size={16} />
                  <span className="text-sm text-slate-500">WhatsApp Support Available</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © {currentYear} DFC: Health & Harmony. All rights reserved.
            </p>
            <p className="text-sm text-slate-400 flex items-center gap-1">
              Made with <FiHeart className="text-red-400" size={14} /> for your wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
