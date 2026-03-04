import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import MyOrders from './pages/MyOrders';
import { useAuth } from './context/AuthContext';
import Logo from './components/Logo';
import DumbbellBg from './components/DumbbellBg';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* Show Dashboard when signed in, landing page otherwise */
const HomeSwitcher = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Home />;
};

function App() {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-10 text-center">
          <div className="mx-auto mb-4 animate-pulse">
            <Logo size={56} className="rounded-2xl shadow-lg" />
          </div>
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading DFC Health & Harmony...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <DumbbellBg />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomeSwitcher /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/plans" element={<PageWrapper><Plans /></PageWrapper>} />
            <Route path="/plans/:slug" element={<PageWrapper><PlanDetail /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageWrapper><Dashboard /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageWrapper><Profile /></PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <PageWrapper><MyOrders /></PageWrapper>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
