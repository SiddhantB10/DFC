import { useRef, useState, useCallback } from 'react';

const GlassCard = ({
  children,
  className = '',
  hover3D = false,
  glowColor = 'rgba(20, 184, 166, 0.08)',
  intensity = 6,
  ...props
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glowStyle, setGlowStyle] = useState({ opacity: 0 });
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!hover3D || !cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      setStyle({
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
      });
      setGlowStyle({
        opacity: 1,
        background: `radial-gradient(circle at ${px}% ${py}%, ${glowColor}, transparent 70%)`,
      });
    });
  }, [hover3D, glowColor, intensity]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
    setGlowStyle({ opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      className={`glass-card relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Liquid light-follow glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          ...glowStyle,
          transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      {/* Subtle top-edge highlight for depth */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none z-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 70%, transparent)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
