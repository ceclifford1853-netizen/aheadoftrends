import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import DigitalOracleScene from "@/components/scenes/DigitalOracleScene";
import Footer from "@/components/Footer";
import { injectWebApplicationSchema, injectOrganizationSchema } from "@/lib/schema";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot_logo_ai_b8ee8557.jpg";

interface ScoreResult {
  scores: {
    overall: number;
    content: number;
    technical: number;
    authority: number;
    visibility: number;
  };
  statusLabel: string;
  recommendations: string[];
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const config = {
      title: "Free AEO Score Checker — AheadOfTrends Ai",
      description: "Instantly analyze how visible your website is to ChatGPT, Gemini, and Claude. Free AEO diagnostic — no signup required.",
      url: "https://aheadoftrends.io",
      imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot_logo_ai_b8ee8557.jpg",
    };
    injectWebApplicationSchema(config);
    injectOrganizationSchema(config);
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    let formattedUrl = url;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }
    try {
      const response = await fetch("/api/aeo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      const raw = (err as Error).message || "";
      if (raw.includes("403")) {
        setError("This website blocks automated analysis (403 Forbidden). Try a different URL, or add your ScraperAPI key to bypass bot protection.");
      } else if (raw.includes("404")) {
        setError("Website not found (404). Check the URL and try again.");
      } else if (raw.includes("ENOTFOUND") || raw.includes("getaddrinfo")) {
        setError("Domain not found. Check the URL spelling and try again.");
      } else {
        setError(raw || "Failed to analyze website. Verify the URL and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000508] text-white">
      {/* 1. Fixed Top Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-cyan-400/10 h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-400 rounded p-1.5 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" fill="black" />
          </div>
          <span className="font-bold text-white text-lg leading-none">
            AheadOfTrends<span className="text-cyan-400 font-bold ml-1">Ai</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="/alpha-rating" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">AEO Tool</a>
          <a href="/pricing" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">Pricing</a>
          <a href="/about" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">About</a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a href="/alpha-rating" className="bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cyan-300 transition-all flex items-center gap-2 group">
            <Zap className="w-3.5 h-3.5" />
            Check AEO Rating
          </a>
        </div>
        {/* Mobile CTA — compact */}
        <a href="/alpha-rating" className="md:hidden bg-cyan-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
          <Zap className="w-3 h-3" />AEO
        </a>
      </nav>

      {/* 2. Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 px-4">
        <div className="absolute inset-0 z-0">
          <DigitalOracleScene />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 border border-cyan-400/20 bg-black/40 px-3 py-1 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
              AEO DIAGNOSTIC ENGINE — ONLINE
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tighter">
            <span className="text-white">Free </span>
            <span className="text-[#ff2d78] animate-pulse">AEO</span>
            <span className="text-[#00f0ff]"> Score</span>
            <span className="text-white"> Checker</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
            No signup. Instant results. Real DOM analysis — zero hallucinations.
          </p>

          {/* Glassmorphism AEO tool card */}
          <div className="bg-black/80 backdrop-blur-2xl border border-[#00f0ff]/40 rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-[0_0_60px_rgba(0,190,255,0.15)] mb-16">
            <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4 mb-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourcompany.com"
                className="flex-grow border border-[#00f0ff]/50 bg-black/60 text-white rounded-xl px-4 py-3.5 w-full text-lg font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#00f0ff] text-black font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:bg-[#a6feff] flex items-center justify-center gap-2 group transition-all text-lg min-w-[180px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Analyzing...</>
                ) : (
                  <><Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />Check Score</>
                )}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 font-medium">
              100% Free • Instant • 4-Factor Analysis • No Signup Required
            </p>
          </div>

          {/* Results Panel */}
          {result && (
            <div className="bg-black/80 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 w-full max-w-3xl text-left shadow-[0_0_80px_rgba(0,190,255,0.1)] mb-16">
              <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-cyan-400/10 pb-6 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-300">Analysis complete for:</h3>
                  <p className="text-2xl font-bold font-mono text-cyan-400 break-all">{url}</p>
                </div>
                <div className="flex items-end gap-3 p-4 bg-cyan-950/30 rounded-xl border border-cyan-900">
                  <span className="text-6xl font-extrabold leading-none text-white tracking-tighter">
                    {result.scores.overall.toFixed(1)}
                  </span>
                  <span className="text-2xl font-bold text-slate-500 pb-1">/ 10</span>
                  <span className={`text-sm font-semibold ml-2 px-3 py-1 rounded ${result.scores.overall > 7 ? 'bg-emerald-600' : result.scores.overall > 4 ? 'bg-amber-600' : 'bg-red-600'}`}>
                    {result.statusLabel}
                  </span>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Content Quality", value: result.scores.content, max: 4 },
                  { label: "Technical SEO", value: result.scores.technical, max: 2.5 },
                  { label: "Authority", value: result.scores.authority, max: 2 },
                  { label: "AI Visibility", value: result.scores.visibility, max: 1.5 },
                ].map((score) => (
                  <div key={score.label} className="border border-cyan-900 bg-cyan-950/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-slate-400 mb-1">{score.label}</div>
                    <div className="text-2xl font-bold text-white">
                      {score.value.toFixed(2)} <span className="text-sm font-medium text-slate-600">/ {score.max}</span>
                    </div>
                  </div>
                ))}
              </div>
              <h4 className="text-lg font-semibold mb-4 text-cyan-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#ff2d78]" fill="#ff2d78" />
                Top Recommendations for LLM Crawlers:
              </h4>
              <ul className="space-y-2.5 list-disc list-outside ml-5 text-slate-300 text-sm md:text-base">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="pl-1 leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-950/50 backdrop-blur-xl border border-red-500 rounded-xl p-6 w-full max-w-2xl text-center mb-16">
              <p className="text-red-300 font-semibold">{error}</p>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" className="animate-bounce">
            <rect x="0.5" y="0.5" width="23" height="35" rx="11.5" stroke="white"/>
            <rect x="11" y="7" width="2" height="6" rx="1" fill="white"/>
          </svg>
          <span className="text-[10px] font-mono text-slate-500 tracking-widest">SCROLL_FOR_INSIGHTS</span>
        </div>
      </main>

      {/* 3. What is AEO */}
      <section className="bg-[#000c14] border-y border-cyan-950 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-mono tracking-[0.3em] text-[#ff2d78] uppercase mb-4 text-center">FUNDAMENTAL_CONCEPTS</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight leading-tight">
            Traditional <span className="text-slate-600 line-through">SEO</span> Is Erosion.<br/> Meet <span className="text-[#00f0ff]">AEO</span>.
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", color: "text-cyan-400", title: "Answer Engine Optimization", body: "Structuring digital properties to be ingested, understood, and confidently cited as authoritative sources by Large Language Models (LLMs) like ChatGPT, Claude, and Gemini. AEO focuses on providing unambiguous answers, not just ranking keywords." },
              { num: "02", color: "text-[#ff2d78]", title: "The Invisibility Problem", body: "If an LLM cannot verify your brand's authority or parse its data cleanly, you are excluded from the answer. Millions of dollars in best-practice SEO is completely invisible to the neural networks that control 2026 search behavior." },
              { num: "03", color: "text-cyan-400", title: "AEO Diagnostic Engine", body: "Our free tool performs raw DOM analysis to determine your AOT Alpha-Rating. We calculate how well your content quality, technical structure, schema markup, and citation networks align with known agentic ingestion requirements. Zero guesswork." },
            ].map(card => (
              <div key={card.num} className="bg-cyan-950/20 border border-cyan-900 p-8 rounded-2xl">
                <div className={`${card.color} font-mono text-xs mb-3`}>{card.num} // CONCEPT</div>
                <h4 className="text-2xl font-bold mb-4 text-white">{card.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Google is Dead */}
      <section className="py-24 px-6 md:px-12 border-b border-cyan-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-mono tracking-[0.3em] text-[#ff2d78] uppercase mb-4">SEARCH_BEHAVIOR_CUTOVER</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              The search is <span className="text-slate-600 line-through">over</span>. <span className="text-white">AI wins.</span>
            </h3>
            <p className="text-slate-300 mb-10 text-lg leading-relaxed">
              Traditional search behavior (typed query → 10 blue links) has eroded 90% since 2024. Users demand synthesized answers. If your brand isn't cited within the agentic answer, you do not exist to that customer.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "User Intent", trad: "Keywords", ai: "Unambiguous Answers" },
                { label: "Response", trad: "Links & Snippets", ai: "Synthesized Text/Code" },
                { label: "Key Factor", trad: "Click-Through Rate", ai: "Source Citation Confidence" },
                { label: "Goal", trad: "Traffic (Erosion)", ai: "Visibility in AI Core" },
              ].map(item => (
                <div key={item.label} className="bg-black border border-cyan-900 rounded-lg p-5">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{item.label}</div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-600 line-through text-sm">{item.trad}</span>
                    <span className="text-cyan-400 font-semibold text-sm">{item.ai}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "90%", desc: "Erosion of 2024 blue-link clicks", color: "#ff2d78" },
              { stat: "10x", desc: "LLM citation > standard ranking for trust", color: "#00f0ff" },
              { stat: "85%", desc: "B2B discovery starts with LLMs in 2026", color: "#ff2d78" },
              { stat: "0s", desc: "Time for hallucinations in AEO scoring", color: "#00f0ff" },
            ].map(card => (
              <div key={card.desc} className="bg-cyan-950/10 border border-cyan-900 rounded-2xl p-6 flex flex-col justify-between h-48 hover:border-cyan-400 transition-colors">
                <div className="text-5xl font-black" style={{ color: card.color }}>{card.stat}</div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Resources / Knowledge Base */}
      <section className="bg-black py-24 px-6 md:px-12 border-b border-cyan-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-mono tracking-[0.3em] text-cyan-400 uppercase mb-4">TECHNICAL_KNOWLEDGE_BASE</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight leading-tight">AheadOfTrends AEO Guide</h3>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>Understanding Answer Engine Optimization (AEO) requires a shift from traditional ranking signals. While SEO was about convincing Google you were relevant, AEO is about proving to Large Language Models (LLMs) that your data is factually accurate, structured properly, and the most comprehensive answer to a given query.</p>
            <p>AEO is the strategic configuration of digital properties to ensure that agentic search platforms (such as ChatGPT Search, Gemini Live, Claude, Perplexity, and others) confidently parse, ingest, and cite your brand as the primary source of truth.</p>
            <p>The AEO diagnostic engine on aheadoftrends.io performs a strict Document Object Model (DOM) analysis of a given URL. Unlike AI-based scoring tools that can introduce hallucinations, our engine is purely deterministic. We analyze the raw HTML to calculate how well your site provides unequivocal answers to AI crawlers.</p>
            <h4 className="text-2xl font-bold text-white pt-4">Understanding The AEO Rating Framework</h4>
            <p>The Alpha-Rating (0–10) is a weighted calculation across four primary agentic ingestion factors. These are not guesses; they are technical requirements based on known scraping and retrieval-augmented generation (RAG) behaviors of foundational models.</p>
            <div className="space-y-4">
              {[
                { title: "Content Quality & Ingestion Depth (40%)", body: "This assesses the actual semantic value of the text. LLMs ignore SEO fluff. We analyze heading structures (H1–H6) to ensure the logical flow is unambiguous. We check for appropriate word depth relative to the complexity of the topic. If an AI crawler encounters ambiguous or repetitive content, the Trust Score drops. Content must provide the answer efficiently." },
                { title: "Technical Performance & Architecture (25%)", body: "AI models are not just smart; they are efficient. They have resource constraints. We check canonicalization to prevent duplication in the vector database. HTTPS use is mandatory. Mobile responsiveness is checked, and page speed is assessed using basic performance signals. A technically sound site is a parseable site." },
                { title: "Schema.org & Entity Identity (20%)", body: "Schema markup is the literal resume of your brand for an AI. It is the language they speak natively. We analyze your implementation of crucial entities: Organization, Product, Person, and FAQPage. Proper semantic tagging allows the AI to place your brand within the Knowledge Graph." },
                { title: "Citation Network Authority (15%)", body: "Where do foundational models look when they can't trust your site? They look to the rest of the web. We assess the quality of inbound links and, crucially, how your brand is cited on trusted technical or government domains. Presence on GitHub, Wikipedia, or authoritative domains adds high entity trust." },
              ].map(item => (
                <div key={item.title} className="border-l-2 border-cyan-400/40 pl-6">
                  <h5 className="font-bold text-cyan-300 mb-2">{item.title}</h5>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <h4 className="text-2xl font-bold text-white pt-4">The Invisibility Problem & Digital Erosion</h4>
            <p>Digital Erosion refers to the 90% drop in traditional search traffic that best-practice SEO has suffered since 2024. Traditional SEO focuses on creating signals (links, keywords, CTR) designed to manipulate a ranking algorithm. AEO focuses on creating facts (data integrity, Schema, unequivocal answers) that a neural network can ingest.</p>
            <p>If your brand lacks the required entity integrity in the foundational models' training data or their live RAG systems, you are effectively invisible to any user performing conversational search. This invisibility cannot be fixed with traditional content marketing; it requires a deep technical alignment with AEO principles.</p>
            <h4 className="text-2xl font-bold text-white pt-4">Applying The Diagnostics: Key Optimizations</h4>
            <p>The recommendations provided in our Alpha-Rating audit are prioritized based on conversion impact. The single highest conversion factor for AEO is unequivocal clarity. If you are optimizing an FAQ page, the FAQPage Schema must align exactly with the H2 headings on the page. Any discrepancy lowers citation confidence.</p>
            <p>Technical performance must also be optimized. In 2026, page load speed is not just a user experience signal; it is an ingestion signal. A crawler with millions of sites to index will not wait for a slow server. Clean code, efficient asset delivery, and a technically solid server infrastructure are critical for consistent AEO visibility.</p>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
