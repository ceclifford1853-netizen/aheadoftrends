import { useState, useEffect } from "react";
import { Zap, Loader2, Share2, Mail, CheckCircle } from "lucide-react";
import DigitalOracleScene from "@/components/scenes/DigitalOracleScene";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { injectWebApplicationSchema, injectOrganizationSchema } from "@/lib/schema";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot_logo_ai_b8ee8557.jpg";

interface ScoreResult {
  scores: {
    contentQuality: number;
    technicalSeo: number;
    authority: number;
    chatVisibility: number;
    overall: number;
  };
  statusLabel: string;
  recommendations: string[];
  analysis: { title: string; url: string };
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    const config = {
      title: "Free AEO Score Checker — AheadOfTrends Ai",
      description: "Instantly analyze how visible your website is to ChatGPT, Gemini, and Claude. Free AEO diagnostic — no signup required.",
      url: "https://aheadoftrends.io",
      imageUrl: LOGO_URL,
    };
    injectWebApplicationSchema(config);
    injectOrganizationSchema(config);
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setLeadSaved(false);
    try {
      const res = await fetch("/api/aeo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error || "Analysis failed";
        if (msg.includes("BLOCKED:403")) {
          toast.error("This site actively blocks automated analysis. Enable ScraperAPI in settings for full coverage.");
        } else {
          toast.error(msg);
        }
        return;
      }
      setResult(data);
    } catch {
      toast.error("Could not reach the analysis engine. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url, score: result.scores.overall }),
      });
      setLeadSaved(true);
      toast.success("Deep audit link has been sent to your inbox.");
    } catch {
      toast.error("Could not save lead.");
    }
  };

  const handleShare = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `My AEO Visibility Score is ${result.scores.overall}/10 (${result.statusLabel})! Check yours free at aheadoftrends.io`
    );
    toast.success("Copied to clipboard! Share your score on social media.");
  };

  return (
    <div className="min-h-screen bg-[#000508] text-white">
      {/* 1. PROMINENT NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/70 backdrop-blur-xl border-b border-cyan-400/10 h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="AheadOfTrends Ai" className="h-9 w-auto rounded object-contain" />
          <span className="font-bold text-base hidden sm:block">AheadOfTrends<span className="text-cyan-400">Ai</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-slate-400">
          <a href="#tool" className="hover:text-cyan-400 transition-colors">AEO Tool</a>
          <a href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          <a href="/about" className="hover:text-cyan-400 transition-colors">About</a>
        </div>
        <a href="/alpha-rating" className="bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-cyan-300 transition-all flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Get Started</span>
          <span className="sm:hidden">AEO</span>
        </a>
      </nav>

      {/* 2. HERO */}
      <main id="tool" className="relative min-h-screen pt-16 flex flex-col items-center justify-center px-4 overflow-hidden">
        <DigitalOracleScene />

        <div className="relative z-10 text-center max-w-4xl w-full">
          <div className="inline-flex items-center gap-2 border border-cyan-400/20 bg-black/40 px-3 py-1 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase">AEO Diagnostic Engine — Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Free <span className="text-[#ff2d78]">AEO</span> <span className="text-cyan-400">Score</span> Checker
          </h1>
          <p className="text-xl text-slate-400 mb-12">Zero-hallucination DOM analysis for the AI-first web.</p>

          {/* TOOL CARD */}
          <div className="bg-black/80 backdrop-blur-2xl border border-cyan-400/30 rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto shadow-2xl shadow-cyan-400/5">
            <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourcompany.com"
                className="flex-1 bg-black/60 border border-cyan-400/40 rounded-xl px-4 py-3 text-lg font-mono focus:border-cyan-400 outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-3 text-center">100% Free • Instant • 4-Factor Analysis • No Signup Required</p>
          </div>

          {/* RESULTS */}
          {result && (
            <div className="mt-8 bg-black/90 border border-cyan-400/40 rounded-2xl p-6 md:p-8 text-left w-full max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-mono tracking-widest mb-1">{result.analysis.title}</p>
                  <h2 className="text-5xl font-black text-cyan-400">
                    {result.scores.overall.toFixed(1)}<span className="text-base text-slate-500">/10</span>
                  </h2>
                  <p className="text-lg font-bold uppercase tracking-widest text-white mt-1">{result.statusLabel}</p>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors border border-white/10 px-3 py-2 rounded-lg"
                >
                  <Share2 className="w-4 h-4" /> Share Score
                </button>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { l: "Content", v: result.scores.contentQuality },
                  { l: "Technical", v: result.scores.technicalSeo },
                  { l: "Authority", v: result.scores.authority },
                  { l: "AI Visibility", v: result.scores.chatVisibility },
                ].map((s) => (
                  <div key={s.l} className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">{s.l}</p>
                    <p className="text-2xl font-black text-cyan-400">{s.v?.toFixed(1) ?? "—"}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* LEAD CAPTURE */}
              {!leadSaved ? (
                <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-5">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-cyan-400" /> Get the full AEO audit report in your inbox
                  </h3>
                  <form onSubmit={handleLeadCapture} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@company.com"
                      className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="bg-white text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-cyan-400 transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" /> Report scheduled for delivery.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ADSENSE PLACEHOLDER */}
      <div className="bg-black py-12 flex justify-center opacity-40 hover:opacity-100 transition-opacity">
        <div className="w-full max-w-4xl h-24 border border-dashed border-white/20 flex items-center justify-center text-xs font-mono text-slate-600">
          GOOGLE ADSENSE PLACEMENT [RESOURCES_ABOVE]
        </div>
      </div>

      {/* AEO EXPLAINER */}
      <section className="bg-[#000c14] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            Your business is <span className="text-[#ff2d78]">invisible</span> to AI
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16 text-lg">
            Google search is no longer the primary discovery channel. ChatGPT, Gemini, and Claude now answer questions directly — and if your site isn't optimized for AI extraction, you don't exist.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "What is AEO?", body: "Answer Engine Optimization (AEO) is the practice of structuring your website so that AI systems like ChatGPT, Perplexity, and Gemini can extract, cite, and recommend your content in direct answers." },
              { title: "The 4 Factors", body: "Content Quality (40%), Technical SEO (25%), Domain Authority (20%), and AI Chat Visibility (15%). Our engine scores each factor from real DOM analysis — no estimates, no guesses." },
              { title: "Why It Matters Now", body: "Over 60% of searches now end without a click. AI answer engines are the new front page. Businesses optimized for AEO get cited in AI responses. Those that aren't simply don't appear." },
            ].map((c) => (
              <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-cyan-400 mb-3">{c.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOOGLE IS DEAD */}
      <section className="py-24 px-4 bg-[#000508]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Traditional Search vs <span className="text-cyan-400">AI Answer Engines</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-white/10 rounded-2xl p-8 opacity-60">
              <h3 className="text-xl font-bold mb-6 text-slate-400">Traditional SEO (Declining)</h3>
              {["Keyword stuffing & backlink farms", "10 blue links — users must click", "Crawlers index pages, not answers", "Results take months to appear", "Zero-click searches: 65% of queries"].map((t) => (
                <div key={t} className="flex gap-3 mb-3 text-sm text-slate-500">
                  <span className="text-red-500 mt-0.5">✕</span>{t}
                </div>
              ))}
            </div>
            <div className="border border-cyan-400/30 rounded-2xl p-8 bg-cyan-400/5">
              <h3 className="text-xl font-bold mb-6 text-cyan-400">AEO (The New Standard)</h3>
              {["Structured data + semantic content depth", "AI cites your brand directly in answers", "Machines extract facts, not pages", "Optimized content cited immediately", "Your brand appears in every relevant answer"].map((t) => (
                <div key={t} className="flex gap-3 mb-3 text-sm text-slate-300">
                  <span className="text-cyan-400 mt-0.5">✓</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
