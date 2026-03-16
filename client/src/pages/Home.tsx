import { useEffect, useState, useRef } from "react";
import PlanetaryHorizon from "@/components/scenes/PlanetaryHorizon";
import Footer from "@/components/Footer";
import { injectWebApplicationSchema, injectOrganizationSchema } from "@/lib/schema";
import { ArrowRight, Search, TrendingDown, TrendingUp, Zap, Eye, EyeOff, Bot, Globe, BarChart3, Shield } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot_logo-n2BqzLqNduSvAK5QEiV3Df.png";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    injectWebApplicationSchema({
      title: "Ahead of Trends - AEO Optimization Platform",
      description: "Advanced Answer Engine Optimization tool with 4-factor scoring algorithm.",
      url: window.location.origin,
    });
    injectOrganizationSchema({
      title: "Ahead of Trends",
      description: "Leading AEO optimization platform.",
      url: window.location.origin,
    });
    // Trigger logo animation after mount
    const t = setTimeout(() => setLogoLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/aeo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000a12] text-white overflow-x-hidden">

      {/* ===== HERO SECTION with Three.js Planetary Horizon ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Three.js Background */}
        <div className="absolute inset-0 z-0">
          <PlanetaryHorizon />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">

          {/* ANIMATED LOGO */}
          <div className={`transition-all duration-[2000ms] ease-out ${logoLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-90'}`}>
            <img
              src={LOGO_URL}
              alt="Ahead of Trends"
              className="h-16 md:h-20 w-auto mb-8 drop-shadow-[0_0_30px_rgba(0,217,255,0.4)]"
            />
          </div>

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 mb-6 transition-all duration-1000 delay-500 ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
              AEO Diagnostic Engine — Online
            </span>
          </div>

          {/* Headline */}
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4 leading-tight transition-all duration-1000 delay-700 ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Free <span className="text-cyan-400" style={{ textShadow: '0 0 20px rgba(0,217,255,0.5)' }}>AEO Score</span> Checker
          </h1>

          <p className={`text-slate-300 text-center text-lg md:text-xl max-w-2xl mb-8 transition-all duration-1000 delay-900 ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            No signup. Instant results. Real DOM analysis — zero hallucinations.
          </p>

          {/* === GLASSMORPHISM AEO SEARCH TOOL === */}
          <div className={`w-full max-w-2xl bg-black/80 backdrop-blur-2xl border border-cyan-400/20 rounded-2xl p-6 md:p-8 transition-all duration-1000 delay-1000 ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="yourcompany.com"
                className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-3 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Scanning..." : "Analyze"}
              </button>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> 100% Free</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Instant</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> 4-Factor</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> No Signup</span>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{result.analysis?.title || result.analysis?.url}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    result.scores.overall >= 7 ? 'bg-green-500/20 text-green-400' :
                    result.scores.overall >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {result.scores.overall}/10 — {result.statusLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Content Quality", score: result.scores.contentQuality, weight: "40%", color: "cyan" },
                    { label: "Technical SEO", score: result.scores.technicalSeo, weight: "25%", color: "pink" },
                    { label: "Authority", score: result.scores.authority, weight: "20%", color: "cyan" },
                    { label: "Chat Visibility", score: result.scores.chatVisibility, weight: "15%", color: "pink" },
                  ].map((f) => (
                    <div key={f.label} className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-center">
                      <div className={`text-2xl font-bold ${f.color === 'cyan' ? 'text-cyan-400' : 'text-pink-400'}`}>
                        {f.score}/10
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{f.label}</div>
                      <div className="text-[10px] text-slate-600">{f.weight} weight</div>
                    </div>
                  ))}
                </div>
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {result.recommendations.slice(0, 4).map((r: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 mt-1 text-cyan-400 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400/40 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-cyan-400/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ===== WHAT IS AEO SECTION ===== */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-[#000a12] via-[#001020] to-[#000a12]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-4 block">The Paradigm Shift</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              What is <span className="text-cyan-400" style={{ textShadow: '0 0 15px rgba(0,217,255,0.4)' }}>Answer Engine Optimization</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              AEO is the discipline of optimizing your digital presence so that AI-powered answer engines — ChatGPT, Perplexity, Google AI Overviews, Claude — can find, understand, and recommend your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/15 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
              <Bot className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">AI Pulls Answers, Not Links</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                When someone asks ChatGPT "What's the best CRM for startups?", the AI doesn't show 10 blue links. It gives one answer. If your business isn't structured for AI comprehension, you don't exist in that answer.
              </p>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-pink-500/15 rounded-xl p-6 hover:border-pink-500/40 transition-all duration-300">
              <EyeOff className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">Invisible Without AEO</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your website might rank #1 on Google and still be completely invisible to AI. LLMs don't crawl your site — they read structured data, schema markup, and authoritative content signals. No AEO means no AI visibility.
              </p>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/15 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
              <Eye className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">The 4-Factor Framework</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our proprietary algorithm scores your site across Content Quality (40%), Technical SEO (25%), Authority Signals (20%), and Chat Visibility (15%) — the exact factors that determine whether AI recommends you.
              </p>
            </div>
          </div>

          {/* Why your business is invisible */}
          <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-red-400 uppercase">Critical Alert</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              If ChatGPT Can't Find You, <span className="text-red-400">You're Losing Revenue Right Now</span>
            </h3>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              Every day, millions of purchase decisions are being made through AI assistants. When a potential customer asks "Who provides the best [your service] in [your city]?", the AI either recommends you — or your competitor. There is no page 2. There is no "scroll down." You're either the answer, or you don't exist.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-cyan-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Schema Markup</h4>
                  <p className="text-sm text-slate-400">JSON-LD structured data tells AI exactly what your business does, where you operate, and why you're authoritative.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-pink-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Content Depth</h4>
                  <p className="text-sm text-slate-400">AI favors comprehensive, well-structured content with clear headings, FAQs, and topical authority over thin pages.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-cyan-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Citation Network</h4>
                  <p className="text-sm text-slate-400">Being referenced by other authoritative sources signals to AI that your business is a trusted entity in your industry.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-pink-400 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Technical Performance</h4>
                  <p className="text-sm text-slate-400">Fast load times, mobile optimization, and clean HTML structure make your content easily parseable by AI crawlers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GOOGLE IS DEAD vs LLM SEARCH ===== */}
      <section className="relative py-24 px-4 bg-[#000a12]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-widest text-pink-400 uppercase mb-4 block">The Data Doesn't Lie</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Google Search is <span className="text-red-400 line-through opacity-60">Dying</span>. <span className="text-cyan-400" style={{ textShadow: '0 0 15px rgba(0,217,255,0.4)' }}>AI Search</span> is Here.
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              The shift from traditional search to AI-powered answer engines is the biggest disruption in digital marketing since the invention of Google itself.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Google - Declining */}
            <div className="bg-black/60 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 mb-6">
                <TrendingDown className="w-8 h-8 text-red-400" />
                <h3 className="text-2xl font-bold text-red-400">Traditional Search</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Click-through rate</span>
                  <span className="text-red-400 font-mono font-bold">-38% since 2023</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Zero-click searches</span>
                  <span className="text-red-400 font-mono font-bold">65% of all queries</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">User behavior</span>
                  <span className="text-red-400 font-mono font-bold">Scrolling 10 links</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Content format</span>
                  <span className="text-slate-500 font-mono">Keyword-stuffed pages</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Discovery model</span>
                  <span className="text-slate-500 font-mono">Rank & pray</span>
                </div>
              </div>
            </div>

            {/* AI Search - Rising */}
            <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
                <h3 className="text-2xl font-bold text-cyan-400">AI Answer Engines</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">User adoption</span>
                  <span className="text-cyan-400 font-mono font-bold">+340% YoY growth</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Answer accuracy</span>
                  <span className="text-cyan-400 font-mono font-bold">Single trusted source</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">User behavior</span>
                  <span className="text-cyan-400 font-mono font-bold">Ask & receive</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Content format</span>
                  <span className="text-cyan-400 font-mono font-bold">Structured authority</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Discovery model</span>
                  <span className="text-cyan-400 font-mono font-bold">Be the answer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { stat: "400M+", label: "Weekly ChatGPT users", color: "cyan" },
              { stat: "65%", label: "Searches end without a click", color: "red" },
              { stat: "87%", label: "Gen Z prefers AI for research", color: "cyan" },
              { stat: "2026", label: "Year AI search overtakes traditional", color: "pink" },
            ].map((s) => (
              <div key={s.label} className="bg-black/40 backdrop-blur-xl border border-slate-800 rounded-xl p-6 text-center hover:border-cyan-400/30 transition-colors">
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  s.color === 'cyan' ? 'text-cyan-400' : s.color === 'pink' ? 'text-pink-400' : 'text-red-400'
                }`} style={{ textShadow: `0 0 10px ${s.color === 'cyan' ? 'rgba(0,217,255,0.3)' : s.color === 'pink' ? 'rgba(236,72,153,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  {s.stat}
                </div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-[#000a12] to-[#001020]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't Wait Until You're <span className="text-red-400">Invisible</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Check your AEO score now — it takes 10 seconds and costs nothing. Find out if AI can find your business before your competitors do.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition-colors text-lg"
          >
            Check Your AEO Score — Free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
