import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#000508] border-t border-white/10 py-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center">
          <span className="font-bold text-white text-xl tracking-tight">
            AheadOfTrends <span className="text-cyan-400">Ai</span>
          </span>
        </div>
        <div className="text-slate-500 text-sm font-medium order-3 md:order-2">
          © 2026 AheadOfTrends Ai. All rights reserved.
        </div>
        <div className="flex items-center gap-6 order-2 md:order-3">
          <a href="/privacy-policy" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200">Privacy</a>
          <a href="/terms-of-service" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200">Terms</a>
          <a href="/blog" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200">Blog</a>
          <a href="mailto:hello@aheadoftrends.io" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
