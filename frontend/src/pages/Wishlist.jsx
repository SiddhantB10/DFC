import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios';
import GlassCard from '../components/GlassCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';

const Wishlist = () => {
  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/wishlist');
      if (data.success) {
        setPlans(data.plans || []);
        setProducts(data.products || []);
      }
    } catch (error) {
      toast.error('Unable to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (itemId, type) => {
    try {
      await API.delete(`/wishlist/${itemId}?type=${type}`);
      if (type === 'plan') {
        setPlans((prev) => prev.filter((plan) => plan._id !== itemId));
      } else {
        setProducts((prev) => prev.filter((product) => product._id !== itemId));
      }
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Unable to remove item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              My <span className="gradient-text">Wishlist</span>
            </h1>
            <p className="text-slate-500">Keep your favorite plans and products and purchase later.</p>
          </div>
        </ScrollReveal>

        {plans.length === 0 && products.length === 0 ? (
          <ScrollReveal>
            <GlassCard className="p-12 text-center">
              <FiHeart className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="font-display font-bold text-lg text-slate-700 mb-2">No wishlist items</h3>
              <p className="text-slate-400 mb-6">Save plans or store products to your wishlist.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link to="/plans" className="glass-btn glass-btn-primary">
                  Browse Plans
                </Link>
                <Link to="/store" className="glass-btn glass-btn-secondary">
                  Browse Store
                </Link>
              </div>
            </GlassCard>
          </ScrollReveal>
        ) : (
          <div className="space-y-8">
            {plans.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-slate-800 mb-4">Plan Wishlist</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {plans.map((plan, i) => (
                    <ScrollReveal key={plan._id} delay={i * 0.05}>
                      <GlassCard className="p-6" hover3D={false}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">{plan.icon}</span>
                              <div>
                                <h3 className="font-display font-semibold text-slate-800">{plan.name}</h3>
                                <p className="text-xs text-slate-400 capitalize">{plan.category}</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-3">{plan.shortDescription}</p>
                            <p className="font-display font-bold text-slate-800">₹{plan.pricing?.monthly?.toLocaleString('en-IN')} /month</p>
                          </div>
                          <button
                            onClick={() => removeItem(plan._id, 'plan')}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-4">
                          <Link to={`/plans/${plan.slug}`} className="glass-btn glass-btn-primary w-full justify-center text-sm">
                            View & Buy
                          </Link>
                        </div>
                      </GlassCard>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {products.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-slate-800 mb-4">Product Wishlist</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {products.map((product, i) => (
                    <ScrollReveal key={product._id} delay={i * 0.05}>
                      <GlassCard className="p-6" hover3D={false}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">🛍️</span>
                              <div>
                                <h3 className="font-display font-semibold text-slate-800">{product.name}</h3>
                                <p className="text-xs text-slate-400 capitalize">{product.category?.name || 'Store Product'}</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-3">{product.shortDescription}</p>
                            <p className="font-display font-bold text-slate-800">₹{(product.discountPrice || product.price)?.toLocaleString('en-IN')}</p>
                          </div>
                          <button
                            onClick={() => removeItem(product._id, 'product')}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-4">
                          <Link to={`/store/${product.slug}`} className="glass-btn glass-btn-primary w-full justify-center text-sm">
                            View Product
                          </Link>
                        </div>
                      </GlassCard>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
