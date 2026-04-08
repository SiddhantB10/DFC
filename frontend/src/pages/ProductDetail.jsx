import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import { FiHeart, FiShoppingCart, FiShare2, FiCheck, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${slug}`);
        if (response.data.success) {
          setProduct(response.data.product);

          if (response.data.product.color.length > 0) {
            const initialColor = response.data.product.color[0];
            setSelectedColor(initialColor);
          }
          if (response.data.product.size.length > 0) {
            setSelectedSize(response.data.product.size[0]);
          }

          // Fetch related products
          if (response.data.product.category) {
            try {
              const relatedRes = await axios.get(
                `/products/category/${response.data.product.category.slug}`,
                { params: { limit: 4 } }
              );
              setRelatedProducts(relatedRes.data.products.filter((p) => p._id !== response.data.product._id));
            } catch (error) {
              console.error('Error fetching related products:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        '/cart',
        {
          productId: product._id,
          quantity,
          color: selectedColor,
          size: selectedSize
        }
      );

      if (response.data.success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        '/wishlist',
        { productId: product._id }
      );

      if (response.data.success) {
        setAddedToWishlist(!addedToWishlist);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href
      });
    } else {
      alert('Share feature not supported on this device');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 relative">
        <FloatingShapes />
        <div className="container-custom relative z-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-100 rounded-lg h-96"></div>
            <div>
              <div className="bg-slate-100 rounded h-8 w-2/3 mb-4"></div>
              <div className="bg-slate-100 rounded h-6 w-1/3 mb-8"></div>
              <div className="space-y-4">
                <div className="bg-slate-100 rounded h-4"></div>
                <div className="bg-slate-100 rounded h-4 w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 relative">
        <FloatingShapes />
        <div className="container-custom relative z-10 text-center">
          <p className="text-slate-600 text-2xl mb-4">Product not found</p>
          <button
            onClick={() => navigate('/store')}
            className="glass-btn glass-btn-primary"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  const discount = product.discount || 0;
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      
      <div className="container-custom relative z-10">
        {/* Breadcrumb */}
        <ScrollReveal>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-8 flex-wrap">
            <button onClick={() => navigate('/store')} className="hover:text-primary-600 transition-colors">
              Store
            </button>
            <FiChevronRight size={16} />
            <button
              onClick={() => navigate(`/store?category=${product.category.slug}`)}
              className="hover:text-primary-600 transition-colors"
            >
              {product.category.name}
            </button>
            <FiChevronRight size={16} />
            <span className="text-slate-700 font-medium">{product.name}</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Visual */}
          <ScrollReveal>
            <div>
              <div className="relative glass-card p-0 overflow-hidden mb-4 h-96 flex items-center justify-center">
                <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-full bg-white/85 backdrop-blur px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-slate-700 shadow-sm">
                  DFC
                </span>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400 text-lg tracking-wide uppercase font-semibold">No Image</span>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                    -{discount}%
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Product Info */}
          <ScrollReveal delay={0.1}>
            <div>
              {/* Header */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full glass text-xs font-medium text-primary-600 mb-3">
                  {product.category.name}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex text-accent-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-slate-500 text-sm">
                  {product.reviews?.length || 0} reviews
                </span>
              </div>

              {/* Price */}
              <div className="glass-card p-5 mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    ₹{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xl text-slate-400 line-through">₹{product.price}</span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-accent-600 text-sm font-semibold">
                    Save ₹{(product.price - (product.discountPrice || product.price)).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-slate-800 font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600">
                        <FiCheck size={18} className="text-accent-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Selection */}
              {product.color && product.color.length > 0 && (
                <div className="mb-6">
                  <label className="text-slate-800 font-semibold mb-3 block text-sm">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.color.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                          selectedColor === color
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.size && product.size.length > 0 && (
                <div className="mb-6">
                  <label className="text-slate-800 font-semibold mb-3 block text-sm">Size</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                          selectedSize === size
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-slate-800 font-semibold mb-3 block text-sm">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="glass-btn glass-btn-secondary text-sm !py-2 !px-3"
                  >
                    −
                  </button>
                  <span className="text-slate-700 text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="glass-btn glass-btn-secondary text-sm !py-2 !px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
                  inStock
                    ? 'bg-accent-100 text-accent-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {inStock ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6 flex-wrap">
                <button
                  onClick={addToCart}
                  disabled={!inStock}
                  className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                    addedToCart
                      ? 'glass-btn glass-btn-success'
                      : 'glass-btn glass-btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <FiCheck size={20} /> Added!
                    </>
                  ) : (
                    <>
                      <FiShoppingCart size={20} /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={addToWishlist}
                  className={`glass-btn transition-all ${
                    addedToWishlist
                      ? 'glass-btn-wishlist'
                      : 'glass-btn-secondary'
                  }`}
                  title="Add to Wishlist"
                >
                  <FiHeart size={20} fill={addedToWishlist ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={shareProduct}
                  className="glass-btn glass-btn-secondary"
                  title="Share Product"
                >
                  <FiShare2 size={20} />
                </button>
              </div>

              {/* Product Meta */}
              <div className="glass-card p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">SKU:</span>
                  <span className="text-slate-800 font-mono font-semibold">{product.sku}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Brand:</span>
                  <span className="text-slate-800 font-semibold">DFC</span>
                </div>
                {product.material && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Material:</span>
                    <span className="text-slate-800 font-semibold">{product.material}</span>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ScrollReveal>
            <div className="pt-8 border-t border-slate-200">
              <h2 className="font-display text-3xl font-bold text-slate-800 mb-6">
                Related <span className="gradient-text">Products</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((prod) => (
                  <button
                    key={prod._id}
                    onClick={() => navigate(`/store/${prod.slug}`)}
                    className="group glass-card p-0 overflow-hidden rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden h-48 bg-slate-100 flex items-center justify-center">
                      <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-[0.22em] text-slate-700 shadow-sm">
                        DFC
                      </span>
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-400 text-sm tracking-wide uppercase font-semibold">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 line-clamp-2 mb-2 text-left text-sm">
                        {prod.name}
                      </h3>
                      <p className="text-sm font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent text-right">
                        ₹{prod.discountPrice || prod.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
