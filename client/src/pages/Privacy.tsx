import React from "react";
import Footer from "@/components/Footer";
import { Zap } from "lucide-react";

const Privacy = () => {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8 italic">Last Updated: March 15, 2026</p>

        <section className="space-y-8 prose prose-invert prose-cyan max-w-none">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Introduction</h2>
            <p>
              Welcome to AheadOfTrends Ai. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website, aheadoftrends.io, and use our AEO diagnostic tools.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you enter a URL for analysis or provide your email address for a deep audit report.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> We collect the URLs you submit for AEO diagnostics to generate your visibility scores.</li>
              <li><strong>Lead Information:</strong> If you request a report, we collect your email address to deliver the diagnostic results.</li>
              <li><strong>Log Data:</strong> Our servers automatically log standard information such as IP addresses, browser types, and access times.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. Cookies and Google AdSense</h2>
            <p>
              We use cookies to improve your experience and analyze site traffic. AheadOfTrends Ai also uses Google AdSense to serve advertisements.
            </p>
            <p>
              Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the Internet. You may opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" className="text-cyan-400 hover:underline">
                Google Ad Settings
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. How We Use Your Information</h2>
            <p>
              We use your data to provide our services, maintain site security, and communicate with you about your AEO reports. We do not sell your personal data to third parties. Data processed for the AEO tool is used solely for the technical generation of the visibility score.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Data Protection</h2>
            <p>
              We implement industry-standard security measures to protect your information. However, please remember that no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="font-mono text-cyan-400">hello@aheadoftrends.io</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
