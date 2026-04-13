import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="glass-card p-8 sm:p-10">
            <h1 className="font-display text-3xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
            <p className="text-slate-600 mb-4">
              DFC Health & Harmony respects your privacy. We collect only necessary information such as profile,
              fitness details, and order data to provide personalized plans and services.
            </p>
            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">Data We Collect</h2>
            <p className="text-slate-600">Name, email, phone, fitness metrics, order history, and support messages.</p>

            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">How We Use Data</h2>
            <p className="text-slate-600">To deliver services, process orders, improve recommendations, and provide support.</p>

            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">Security</h2>
            <p className="text-slate-600">We use secure authentication, encrypted passwords, and role-based access controls.</p>

            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">Contact</h2>
            <p className="text-slate-600">For privacy concerns, contact us via the Contact page.</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
