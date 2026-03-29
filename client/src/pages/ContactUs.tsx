import React, { useState } from 'react';

export default function ContactUs() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Message received. Our AEO team will deploy a response shortly.');
  };

  return (
    <div className="min-h-screen bg-[#000508] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#000508]/80 backdrop-blur-md border-b border-white/5">
        <a href="/" className="font-bold text-lg tracking-tight">Ahead of Trends</a>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="/blog" className="hover:text-white transition-colors">Blog</a>
          <a href="/guides" className="hover:text-white transition-colors">Guides</a>
          <a href="/about-us" className="hover:text-white transition-colors">About</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-32 px-6">
        <h1 className="text-4xl font-bold mb-4 text-[#22d3ee]">Contact Ahead of Trends</h1>
        <p className="text-lg mb-12 text-slate-400">
          Ready to dominate "Share of Model"? Connect with our Cayman-based AEO architects to schedule your visibility audit or discuss enterprise API white-labeling.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Name</label>
                <input type="text" required className="w-full p-3 border border-slate-700 rounded-md bg-slate-900/50 text-white" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Email</label>
                <input type="email" required className="w-full p-3 border border-slate-700 rounded-md bg-slate-900/50 text-white" placeholder="name@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Message</label>
                <textarea required className="w-full p-3 border border-slate-700 rounded-md bg-slate-900/50 text-white h-32" placeholder="How can we optimize your LLM presence?"></textarea>
              </div>
              <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-md hover:from-cyan-400 hover:to-blue-400 transition-colors font-bold">
                Send Transmission
              </button>
              {status && <p className="mt-4 text-sm font-bold text-[#22d3ee]">{status}</p>}
            </form>
          </div>
          <div className="bg-slate-900/50 p-8 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-[#22d3ee]">Global Headquarters</h3>
            <p className="mb-2 text-slate-300">Ahead of Trends</p>
            <p className="mb-6 text-slate-400">Grand Cayman, Cayman Islands</p>
            <h3 className="text-xl font-bold mb-4 text-[#22d3ee]">Direct Comm</h3>
            <p className="mb-2 text-slate-300"><strong>Email:</strong> info@aheadoftrends.io</p>
            <p className="text-sm text-slate-500 mt-8">
              Operating in UTC-5. Priority given to Retainer and Level 2 Audit clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
