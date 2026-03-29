import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#000508] text-slate-300">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#000508]/80 backdrop-blur-md border-b border-white/5">
        <a href="/" className="font-bold text-lg tracking-tight">Ahead of Trends</a>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="/blog" className="hover:text-white transition-colors">Blog</a>
          <a href="/guides" className="hover:text-white transition-colors">Guides</a>
          <a href="/about-us" className="hover:text-white transition-colors">About</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-32 px-6">
        <h1 className="text-4xl font-bold mb-4 text-[#22d3ee]">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-12">Last Updated: March 29, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-400 leading-relaxed">
              By accessing aheadoftrends.io, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access our AEO tools or APIs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property & Methodology</h2>
            <p className="text-slate-400 leading-relaxed">
              Our proprietary AEO Audit frameworks, Semantic Cluster Analysis algorithms, and Citation Strength Formulas remain the exclusive intellectual property of Ahead of Trends. White-label API partners are granted a revocable, non-exclusive license strictly for reporting purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Limitation of Liability</h2>
            <p className="text-slate-400 leading-relaxed">
              Large Language Models (LLMs) are non-deterministic. Ahead of Trends guarantees the execution of best-in-class AEO strategy, but cannot guarantee specific "Share of Model" metrics or immediate retrieval by ChatGPT, Perplexity, or Gemini. We are not liable for business losses resulting from AI algorithm updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Governing Law & Dispute Resolution</h2>
            <p className="text-slate-400 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the Cayman Islands. Any disputes arising from these Terms or our services shall be resolved exclusively in the courts of the Cayman Islands.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Account Termination</h2>
            <p className="text-slate-400 leading-relaxed">
              We reserve the right to terminate or suspend access to our API and Retainer services immediately, without prior notice, for conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
