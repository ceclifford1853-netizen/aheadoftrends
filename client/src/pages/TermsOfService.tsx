import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-[#000508] text-slate-300 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-invert prose-cyan">
        <h1 className="text-[#22d3ee] text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-12">Last Updated: March 18, 2026</p>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>By accessing aheadoftrends.io, you agree to be bound by these Terms of Service and all applicable laws and regulations in the Cayman Islands.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">2. Intellectual Property</h2>
          <p>The $V_i$ Visibility Formula, Agentic Dominance protocols, and all Cyber Noir design elements are the exclusive intellectual property of Ahead of Trends. Unauthorized reproduction is prohibited.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">3. Use of Content</h2>
          <p>Our AEO articles and manifestos are provided for informational purposes. While we optimize for AI ingestion, we do not guarantee specific search engine or answer engine rankings.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">4. Limitation of Liability</h2>
          <p>Ahead of Trends shall not be held liable for any digital invisibility or loss of data resulting from the use of our optimization protocols.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
