import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';
import { FiChevronDown } from 'react-icons/fi';

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('q') || '';
  const sortBy = searchParams.get('sortBy') || '-createdAt';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/products/categories');
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          sortBy
        };

        if (category !== 'all') {
          params.category = category;
        }
        if (search) {
          params.q = search;
        }
        if (minPrice) {
          params.minPrice = minPrice;
        }
        if (maxPrice) {
          params.maxPrice = maxPrice;
        }

        const response = await axios.get('/products', { params });
        if (response.data.success) {
          setProducts(response.data.products);
          setTotalPages(response.data.pages);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, sortBy, minPrice, maxPrice, page]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', sort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearch = (query) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceFilter = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) {
      newParams.set('minPrice', min);
    } else {
      newParams.delete('minPrice');
    }
    if (max) {
      newParams.set('maxPrice', max);
    } else {
      newParams.delete('maxPrice');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-primary-600 mb-4">
              Premium Gear
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
              DFC <span className="gradient-text">Store</span>
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Discover premium fitness equipment, apparel, and accessories curated for your perfect training experience.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <ScrollReveal className="lg:col-span-1">
            <div className="space-y-4">
              {/* Search */}
              <div className="glass-card p-4">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">Search</h3>
                <input
                  type="text"
                  placeholder="Product name..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="glass-input text-sm"
                />
              </div>

              {/* Categories */}
              <div className="glass-card p-4">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      category === 'all'
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm flex items-center gap-2 ${
                        category === cat.slug
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="glass-card p-4">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">Price Range</h3>
                <div className="space-y-2">
                  <select
                    value={minPrice}
                    onChange={(e) => handlePriceFilter(e.target.value, maxPrice)}
                    className="glass-input text-sm"
                  >
                    <option value="">Min Price</option>
                    <option value="0">₹0</option>
                    <option value="500">₹500</option>
                    <option value="1000">₹1000</option>
                    <option value="5000">₹5000</option>
                    <option value="10000">₹10000</option>
                  </select>
                  <select
                    value={maxPrice}
                    onChange={(e) => handlePriceFilter(minPrice, e.target.value)}
                    className="glass-input text-sm"
                  >
                    <option value="">Max Price</option>
                    <option value="1000">₹1000</option>
                    <option value="5000">₹5000</option>
                    <option value="10000">₹10000</option>
                    <option value="25000">₹25000</option>
                    <option value="50000">₹50000</option>
                  </select>
                </div>
              </div>

              {/* Sorting */}
              <div className="glass-card p-4">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="glass-input text-sm"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Rating: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </ScrollReveal>

          {/* Products Grid */}
          <ScrollReveal className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="bg-slate-200 rounded-lg h-48 mb-3"></div>
                    <div className="bg-slate-200 rounded h-4 mb-2 w-2/3"></div>
                    <div className="bg-slate-200 rounded h-3 w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-slate-500">
                  Showing {products.length} of {Math.ceil(products.length)} products
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="glass-btn glass-btn-secondary text-sm !py-2.5 !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          page === i + 1
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                            : 'glass text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="glass-btn glass-btn-secondary text-sm !py-2.5 !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-500 text-lg mb-4">No products found</p>
                <button
                  onClick={() => {
                    setSearchParams({});
                  }}
                  className="glass-btn glass-btn-primary text-sm !py-2.5 !px-6"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Store;
