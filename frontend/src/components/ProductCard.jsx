import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const discountPercent = product.discount || 0;

  return (
    <button
      onClick={() => navigate(`/store/${product.slug}`)}
      className="group glass-card p-0 overflow-hidden rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all text-left w-full"
    >
      {/* Visual Header */}
      <div className="relative overflow-hidden h-48 bg-slate-100 flex items-center justify-center">
        <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-[0.22em] text-slate-700 shadow-sm">
          DFC
        </span>
        <span className="text-slate-400 text-sm tracking-wide uppercase font-semibold">No Image</span>
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercent}%
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
          {product.category?.name}
        </p>
        <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 text-sm">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-accent-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {product.rating ? product.rating.toFixed(1) : 'New'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 pb-3 border-b border-slate-200">
          <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            ₹{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <div className="flex items-center justify-between text-xs">
            <span className="text-accent-600 font-semibold">
              {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
            </span>
            <span className="glass-btn glass-btn-primary text-xs !py-1.5 !px-2">
              View
            </span>
          </div>
        ) : (
          <div className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded text-center">
            Out of Stock
          </div>
        )}
      </div>
    </button>
  );
};

export default ProductCard;
