import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight, Zap } from "lucide-react";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-pink-500/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 mb-8">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">
              AEO Authority Intelligence
            </span>
          </div>

          {/* Main heading with glow */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-white mb-2">
              Stay Ahead of
            </span>
            <span className="block glow-cyan text-cyan-400">
              Trends
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Unlock your website's AEO potential with our advanced 4-factor optimization engine. 
            Get real-time insights on Quality, SEO, Authority, and Visibility—the metrics that matter 
            for Answer Engine Optimization.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-cyan-400/50 transition-colors">
              <div className="text-2xl font-bold text-cyan-400 mb-2">40%</div>
              <p className="text-sm text-slate-300">Content Quality</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-cyan-400/50 transition-colors">
              <div className="text-2xl font-bold text-pink-500 mb-2">25%</div>
              <p className="text-sm text-slate-300">Technical SEO</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-cyan-400/50 transition-colors">
              <div className="text-2xl font-bold text-cyan-400 mb-2">35%</div>
              <p className="text-sm text-slate-300">Authority & Visibility</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/alpha-rating")}
              className="btn-neon-cyan group"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:border-pink-500 hover:text-pink-400 transition-colors"
            >
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-400 mb-4">
              Trusted by leading agencies and enterprises
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
              <span className="text-slate-500 font-semibold">Agency Partners</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500 font-semibold">500+ Audits</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500 font-semibold">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl opacity-20 animate-pulse" />
    </section>
  );
}
