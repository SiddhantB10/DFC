import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiUser, FiLogOut, FiGrid, FiShoppingBag, FiHeart, FiShield } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: user ? 'Dashboard' : 'Home' },
    { to: '/store', label: 'Store' },
    { to: '/plans', label: 'Plans' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 navbar-liquid ${
        scrolled
          ? 'glass-nav py-4'
          : 'glass-nav py-5'
      }`}
      style={{ transition: 'padding 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Logo size={40} className="shadow-lg group-hover:shadow-primary-500/30 transition-shadow duration-300 rounded-xl" />
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-tight gradient-text">
                DFC
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">
                Health & Harmony
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <LayoutGroup id="nav">
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
                    isActive(link.to)
                      ? 'text-primary-700'
                      : 'text-slate-600 hover:text-primary-600'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-0.5 inset-x-0 mx-auto w-8 h-[3px] rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)' }}
                    />
                  )}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 rounded-xl bg-white/50"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </LayoutGroup>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full bg-white/40 border border-white/30 hover:bg-white/55 hover:border-white/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/20 ring-2 ring-white/50">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-slate-800 max-w-[100px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">My Account</span>
                  </div>
                  <svg className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2.5 w-56 py-2 rounded-2xl shadow-2xl z-50 bg-white/80 backdrop-blur-xl border border-white/40"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 mb-1 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl mx-1.5 transition-all duration-200"
                      >
                        <FiGrid size={16} /> Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl mx-1.5 transition-all duration-200"
                      >
                        <FiUser size={16} /> Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl mx-1.5 transition-all duration-200"
                      >
                        <FiShoppingBag size={16} /> My Orders
                      </Link>
                      <Link
                        to="/cart"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl mx-1.5 transition-all duration-200"
                      >
                        <FiShoppingBag size={16} /> Cart
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl mx-1.5 transition-all duration-200"
                      >
                        <FiHeart size={16} /> Wishlist
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl mx-1.5 transition-all duration-200"
                        >
                          <FiShield size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="h-px bg-slate-100 my-1.5 mx-4" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/60 rounded-xl mx-1.5 transition-all duration-200 w-[calc(100%-12px)]"
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="glass-btn glass-btn-primary text-sm !py-2.5 !px-6"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl glass"
          >
            {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, height: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden mt-4 overflow-hidden max-h-[70vh] overflow-y-auto"
            >
              <div className="glass-strong rounded-2xl p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? 'text-primary-700 bg-primary-50/80'
                        : 'text-slate-600 hover:bg-white/40'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/30 my-2 pt-2">
                  {user ? (
                    <>
                      <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/40">
                        Dashboard
                      </Link>
                      <Link to="/profile" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/40">
                        Profile
                      </Link>
                      <Link to="/cart" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/40">
                        Cart
                      </Link>
                      <Link to="/wishlist" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/40">
                        Wishlist
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/40">
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50/50">
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <Link to="/login" className="flex-1 text-center py-3 rounded-xl text-sm font-medium glass">
                        Sign In
                      </Link>
                      <Link to="/register" className="flex-1 text-center py-3 rounded-xl text-sm font-medium glass-btn glass-btn-primary">
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
