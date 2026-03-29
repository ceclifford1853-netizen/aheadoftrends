import React from 'react';

export default function PrivacyPolicy() {
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
        <h1 className="text-4xl font-bold mb-4 text-[#22d3ee]">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-12">Last Updated: March 29, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-slate-400 leading-relaxed">
              Ahead of Trends ("we," "our," or "us"), operating out of the Cayman Islands, is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your data when you visit aheadoftrends.io and use our Answer Engine Optimization (AEO) services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data Collection & AdSense Cookies</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We use third-party vendors, including Google, which use cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-[#22d3ee] hover:underline">Ads Settings</a>.</li>
              <li>We collect standard analytics data (IP address, browser type, navigation paths) to improve our AEO infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Global Compliance (Cayman DPA, GDPR, CCPA)</h2>
            <p className="text-slate-400 leading-relaxed">
              Our data practices comply with the Cayman Islands Data Protection Act (DPA). If you are a resident of the European Economic Area (EEA) or California, you have the right to access, rectify, or erase your personal data under GDPR and CCPA regulations. We do not sell personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Retention and Security</h2>
            <p className="text-slate-400 leading-relaxed">
              Client audit data and API keys are encrypted at rest and in transit. We retain raw scraper data for a maximum of 90 days unless part of an active Citation Retainer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Information</h2>
            <p className="text-slate-400 leading-relaxed">
              For data deletion requests or privacy inquiries, contact our Data Protection Officer at: <strong className="text-white">info@aheadoftrends.io</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
