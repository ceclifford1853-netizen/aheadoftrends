import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#000508] text-slate-300 min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-invert prose-cyan">
        <h1 className="text-[#22d3ee] text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-12">Last Updated: March 18, 2026</p>
        
        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">1. Introduction</h2>
          <p>Ahead of Trends ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit aheadoftrends.io, in compliance with Cayman Islands Data Protection Act (DPA) and international standards.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">2. Information Collection</h2>
          <p>We use Google AdSense to serve advertisements. Google uses cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">3. Cookies and Tracking</h2>
          <p>Users may opt out of personalized advertising by visiting Ads Settings or by visiting www.aboutads.info. We also use internal analytics to monitor Agentic Ingestion rates and site performance.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">4. Jurisdiction</h2>
          <p>This policy is governed by the laws of the Cayman Islands. Any disputes arising from the use of this site shall be subject to the exclusive jurisdiction of the Cayman Islands courts.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">5. Contact Us</h2>
          <p>For privacy inquiries, please contact our Digital Oracle team at info@aheadoftrends.io.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
