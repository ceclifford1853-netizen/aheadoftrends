import { useLocation } from "wouter";

export default function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg glow-cyan text-cyan-400 mb-4">
              Ahead of Trends
            </h3>
            <p className="text-slate-400 text-sm">
              Advanced AEO optimization for agencies that lead the market.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/alpha-rating")}
                  className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  AEO Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/pricing")}
                  className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/blog")}
                  className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/about-us")}
                  className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/audits")}
                  className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Audits
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/terms-of-service")}
                  className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2026 Ahead of Trends. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
