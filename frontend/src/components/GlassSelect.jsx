import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const GlassSelect = ({ name, value, onChange, options = [], placeholder = 'Select...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find(opt =>
    typeof opt === 'string' ? opt === value : opt.value === value
  );

  const normalizedOptions = useMemo(() => options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  ), [options]);

  const selectedLabel = selectedOption
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : null;

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = useCallback((optValue) => {
    // simulate native onChange event shape
    onChange({ target: { name, value: optValue } });
    setIsOpen(false);
  }, [name, onChange]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        const idx = normalizedOptions.findIndex(o => o.value === value);
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, normalizedOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(normalizedOptions[focusedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  }, [isOpen, focusedIndex, normalizedOptions, value, handleSelect]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(prev => !prev);
          if (!isOpen) {
            const idx = normalizedOptions.findIndex(o => o.value === value);
            setFocusedIndex(idx >= 0 ? idx : 0);
          }
        }}
        onKeyDown={handleKeyDown}
        className={`
          glass-select-trigger w-full text-left flex items-center justify-between
          bg-white/40 backdrop-blur-[16px] saturate-[160%]
          border-[1.5px] rounded-2xl
          px-[18px] py-[14px]
          text-[0.95rem] outline-none
          transition-all duration-300
          ${isOpen
            ? 'border-primary-400/60 bg-white/65 shadow-[0_0_0_4px_rgba(20,184,166,0.10),0_4px_20px_rgba(0,0,0,0.05)]'
            : 'border-white/35 hover:border-primary-400/35 hover:bg-white/55 hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)]'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selectedLabel ? 'text-slate-900' : 'text-slate-400'}>
          {selectedLabel || placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="text-primary-500 ml-2 flex-shrink-0"
        >
          <FiChevronDown size={18} strokeWidth={2.5} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="
              absolute z-50 left-0 right-0 mt-2
              bg-white/80 backdrop-blur-2xl saturate-[180%]
              border border-white/50
              rounded-2xl overflow-hidden
              shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]
            "
          >
            <ul
              ref={listRef}
              role="listbox"
              className="py-1.5 max-h-[220px] overflow-y-auto glass-select-list"
            >
              {normalizedOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isFocused = idx === focusedIndex;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`
                      flex items-center justify-between
                      px-4 py-2.5 mx-1.5 rounded-xl
                      cursor-pointer select-none
                      text-[0.9rem] font-medium
                      transition-colors duration-150
                      ${isSelected
                        ? 'text-primary-700 bg-primary-50/80'
                        : isFocused
                          ? 'text-slate-800 bg-slate-100/60'
                          : 'text-slate-600 hover:bg-slate-50/60'
                      }
                    `}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-primary-500"
                      >
                        <FiCheck size={16} strokeWidth={3} />
                      </motion.span>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassSelect;
