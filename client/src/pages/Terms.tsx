import React from "react";
import Footer from "@/components/Footer";
import { Zap } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#000508] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/70 backdrop-blur-xl border-b border-cyan-400/10 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-400 rounded p-1.5">
            <Zap className="w-4 h-4 text-black" fill="black" />
          </div>
          <a href="/" className="font-bold text-lg">
            AheadOfTrends<span className="text-cyan-400">Ai</span>
          </a>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto pt-32 pb-24 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8 italic">Effective Date: March 15, 2026</p>

        <section className="space-y-8 prose prose-invert prose-cyan max-w-none">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing aheadoftrends.io, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Use of AEO Diagnostic Tool</h2>
            <p>
              AheadOfTrends Ai provides a free diagnostic tool to analyze website visibility in AI answer engines. This tool is provided for educational and informational purposes only.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree not to use the tool for any unlawful purpose.</li>
              <li>You agree not to attempt to circumvent our technical security measures or scrape data from our platform for commercial reuse.</li>
              <li>We reserve the right to limit access to the tool at our discretion to prevent abuse.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. Accuracy of Data</h2>
            <p>
              While we strive for a "zero-hallucination" deterministic analysis based on raw DOM data, AEO scores are estimates based on our proprietary 4-factor framework. We do not guarantee that your website will rank first in specific AI platforms based solely on our score.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Limitation of Liability</h2>
            <p>
              AheadOfTrends Ai and its founder, Charles E. Clifford Jr., shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our tools or information provided on the site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Intellectual Property</h2>
            <p>
              All content, including the AEO scoring formula, branding, and technical assets, are the intellectual property of AheadOfTrends Ai.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">6. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Cayman Islands. Any disputes shall be subject to the exclusive jurisdiction of the courts in the Cayman Islands.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
