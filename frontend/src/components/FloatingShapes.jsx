const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Soft color orbs */}
      <div className="liquid-orb liquid-orb-1" />
      <div className="liquid-orb liquid-orb-2" />
      <div className="liquid-orb liquid-orb-3" />

      {/* Glass floating panes */}
      <div
        className="glass-float glass-float-md"
        style={{ top: '12%', right: '8%', animationDelay: '0s', animationDuration: '9s' }}
      />
      <div
        className="glass-float glass-float-sm glass-float-circle"
        style={{ top: '55%', left: '4%', animationDelay: '2s', animationDuration: '11s' }}
      />
      <div
        className="glass-float glass-float-lg"
        style={{ bottom: '15%', right: '12%', animationDelay: '4s', animationDuration: '13s' }}
      />
      <div
        className="glass-float glass-float-sm"
        style={{ top: '30%', left: '12%', animationDelay: '1s', animationDuration: '10s' }}
      />
      <div
        className="glass-float glass-float-md glass-float-circle"
        style={{ top: '20%', left: '45%', animationDelay: '3s', animationDuration: '12s' }}
      />
      <div
        className="glass-float glass-float-sm"
        style={{ bottom: '25%', right: '35%', animationDelay: '5s', animationDuration: '14s' }}
      />
    </div>
  );
};

export default FloatingShapes;
