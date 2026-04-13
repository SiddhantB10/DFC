import ScrollReveal from '../components/ScrollReveal';
import FloatingShapes from '../components/FloatingShapes';

const TermsConditions = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <FloatingShapes />
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="glass-card p-8 sm:p-10">
            <h1 className="font-display text-3xl font-bold text-slate-800 mb-4">Terms and Conditions</h1>
            <p className="text-slate-600 mb-4">
              By using DFC Health & Harmony, you agree to these terms related to services, plans, store orders,
              payments, and account usage.
            </p>

            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">Account Responsibility</h2>
            <p className="text-slate-600">You are responsible for maintaining account credentials and activity.</p>

            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">Payments and Orders</h2>
            <p className="text-slate-600">All payments are processed securely. Orders are confirmed after successful payment verification.</p>

            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">Loyalty and Referral Program</h2>
            <p className="text-slate-600">Points are promotional benefits and may be updated under platform policy when needed.</p>

            <h2 className="font-display text-xl font-semibold text-slate-800 mt-6 mb-2">Support</h2>
            <p className="text-slate-600">For disputes or support, use the Contact page and admin support process.</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default TermsConditions;
