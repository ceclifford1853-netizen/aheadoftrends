import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Zap, Shield, BarChart3, Eye, Loader2, ArrowRight, CheckCircle, ExternalLink, Mail } from 'lucide-react';
import { Link } from 'wouter';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot-hero-logo_d6a1cc78.jpg';

interface AeoScores {
  contentQuality: number;
  technicalSeo: number;
  authority: number;
  chatVisibility: number;
  overall: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<AeoScores | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [statusLabel, setStatusLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Free AEO Score Checker - Ahead of Trends",
        "url": "https://aheadoftrends.io",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "The internet's only free, instant, one-click AEO (AI Engine Optimization) diagnostic tool. Get your website's AI visibility score in seconds — no signup required.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "creator": { "@type": "Organization", "name": "Ahead of Trends", "url": "https://aheadoftrends.io" }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is AEO (AI Engine Optimization)?",
            "acceptedAnswer": { "@type": "Answer", "text": "AEO is the practice of optimizing your website so AI chat engines like ChatGPT, Perplexity, Claude, and Gemini can find, understand, and recommend your business. It goes beyond traditional SEO by focusing on structured data, answer-ready content, and AI-crawlable markup." }
          },
          {
            "@type": "Question",
            "name": "How do I check my website's AEO score for free?",
            "acceptedAnswer": { "@type": "Answer", "text": "Visit aheadoftrends.io and enter your website URL. Our free tool instantly analyzes your site across 4 factors: Content Quality, Technical SEO, Authority, and Chat Visibility. No signup or payment required." }
          },
          {
            "@type": "Question",
            "name": "Why is AEO important for businesses in 2025?",
            "acceptedAnswer": { "@type": "Answer", "text": "AI chat engines are replacing traditional search for millions of users. If your business isn't optimized for AI recommendations, you're invisible to a growing segment of potential customers who ask ChatGPT, Perplexity, or Claude for business recommendations instead of using Google." }
          }
        ]
      }
    ];
    const existingScripts = document.querySelectorAll('script[data-aeo-schema]');
    existingScripts.forEach(s => s.remove());
    schemas.forEach((schema, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-aeo-schema', `schema-${i}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
    return () => { document.querySelectorAll('script[data-aeo-schema]').forEach(s => s.remove()); };
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScores(null);
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) normalizedUrl = 'https://' + normalizedUrl;

    try {
      const response = await fetch('/api/aeo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.scores) {
          setScores(data.scores);
          setRecommendations(data.recommendations || []);
          setStatusLabel(data.statusLabel || '');
        } else {
          setError('Could not parse response.');
        }
      } else {
        const errData = await response.json().catch(() => null);
        setError(errData?.error || 'Failed to analyze. The site may block crawlers.');
      }
    } catch {
      setError('Network error. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (val: number) => val >= 70 ? 'text-emerald-400' : val >= 40 ? 'text-amber-400' : 'text-red-400';
  const getBarColor = (val: number) => val >= 70 ? 'from-emerald-500 to-cyan-500' : val >= 40 ? 'from-amber-500 to-yellow-500' : 'from-red-500 to-pink-500';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO: Logo + AEO Tool — Above the Fold, Zero Signup   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="container relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={LOGO_URL}
              alt="Ahead of Trends AI - Free AEO Score Checker"
              className="w-full max-w-2xl h-auto object-contain"
              style={{ imageRendering: 'auto' }}
            />
          </div>

          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Free <span className="text-cyan-400">AEO Score</span> Checker
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-2">
              The internet's only <strong>instant, one-click</strong> AI Engine Optimization diagnostic.
            </p>
            <p className="text-slate-400">
              No signup. No payment. Enter your URL and get your score in seconds.
            </p>
          </div>

          {/* AEO Input Tool */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-slate-900/80 border-cyan-500/30 p-6 md:p-8 shadow-lg shadow-cyan-500/5">
              <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Enter any website URL (e.g. yourcompany.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500 h-12 text-lg flex-1"
                  required
                />
                <Button type="submit" className="btn-neon h-12 px-8 text-base whitespace-nowrap" disabled={!url || loading}>
                  {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning...</> : <><Zap className="w-5 h-5 mr-2" /> Get Free Score</>}
                </Button>
              </form>

              {error && (
                <p className="text-red-400 text-sm mt-3 bg-red-500/10 border border-red-500/30 rounded p-3">{error}</p>
              )}

              {/* Trust indicators */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-slate-500">
                <div><Shield className="w-4 h-4 mx-auto mb-1 text-cyan-500" />100% Free</div>
                <div><Zap className="w-4 h-4 mx-auto mb-1 text-cyan-500" />Instant Results</div>
                <div><BarChart3 className="w-4 h-4 mx-auto mb-1 text-cyan-500" />4-Factor Score</div>
                <div><Eye className="w-4 h-4 mx-auto mb-1 text-cyan-500" />No Signup</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* RESULTS: Shown inline after scan                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      {scores && (
        <section className="py-12 border-t border-slate-800">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Your AEO Score</h2>
              <p className="text-slate-400">Results for <span className="text-cyan-400">{url}</span></p>
            </div>

            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/50 p-10 mb-8 text-center">
              <p className="text-slate-400 mb-3 uppercase tracking-wider text-sm">AI Visibility Score</p>
              <div className="text-7xl font-bold text-cyan-400 mb-3">{scores.overall}<span className="text-2xl text-slate-500">/10</span></div>
              <p className="text-slate-300 text-lg">{statusLabel}</p>
            </Card>

            {/* 4-Factor Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Content Quality', value: scores.contentQuality, weight: '40%', icon: BarChart3 },
                { label: 'Technical SEO', value: scores.technicalSeo, weight: '25%', icon: Shield },
                { label: 'Authority', value: scores.authority, weight: '20%', icon: Zap },
                { label: 'Chat Visibility', value: scores.chatVisibility, weight: '15%', icon: Eye },
              ].map((f) => (
                <Card key={f.label} className="bg-slate-900/50 border-slate-700 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <f.icon className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-bold text-sm">{f.label}</h3>
                    </div>
                    <span className={`font-bold text-sm ${getScoreColor(f.value)}`}>{f.value}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className={`bg-gradient-to-r ${getBarColor(f.value)} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${f.value}%` }} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-700 p-6 mb-8">
                <h3 className="font-bold text-lg mb-4 text-cyan-400">What to Fix</h3>
                <ul className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="text-cyan-400 mt-0.5 shrink-0">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Email report + Deep Audit CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border-cyan-500/30 p-6">
                <h3 className="font-bold mb-2">Email This Report</h3>
                <p className="text-slate-400 text-sm mb-3">Get your results sent to your inbox.</p>
                {emailSent ? (
                  <p className="text-cyan-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Sent!</p>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setEmailSent(true); }} className="flex gap-2">
                    <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500 flex-1" required />
                    <Button type="submit" className="btn-neon"><Mail className="w-4 h-4" /></Button>
                  </form>
                )}
              </Card>
              <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30 p-6">
                <h3 className="font-bold mb-2">Need Us to Fix It?</h3>
                <p className="text-slate-400 text-sm mb-3">Our team will optimize your site for AI engines.</p>
                <a href="https://ko-fi.com/aheadoftrendsautomatedaiagents" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold">
                    <ExternalLink className="w-4 h-4 mr-2" /> Request Deep Audit
                  </Button>
                </a>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* EDUCATIONAL CONTENT: What is AEO? (AdSense + LLM SEO) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 border-t border-slate-800">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What is AEO (AI Engine Optimization)?</h2>

          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-slate-300">
            <p>
              <strong>AI Engine Optimization (AEO)</strong> is the practice of structuring your website's content, metadata, and markup so that AI-powered chat engines — such as ChatGPT, Google Gemini, Perplexity, Claude, and Microsoft Copilot — can accurately find, understand, and recommend your business to users.
            </p>

            <p>
              Unlike traditional SEO, which focuses on ranking in a list of ten blue links, AEO targets the conversational answer layer. When a user asks an AI assistant "What's the best bakery near me?" or "Which SaaS tool handles invoicing?", the AI doesn't show a list — it gives one or two direct recommendations. If your business isn't optimized for that answer, you are invisible to a rapidly growing audience.
            </p>

            <h3 className="text-2xl font-bold text-cyan-400 mt-8">Why Does AEO Matter in 2025?</h3>
            <p>
              Over 40% of Gen Z users now prefer asking AI assistants over using Google Search. Enterprise buyers increasingly rely on AI summaries for vendor shortlisting. The shift from "search and browse" to "ask and receive" means that businesses without AEO optimization are losing market share every day — often without realizing it.
            </p>

            <h3 className="text-2xl font-bold text-cyan-400 mt-8">How Does Our Free AEO Score Work?</h3>
            <p>
              Our diagnostic tool crawls your website in real-time and evaluates it across four weighted factors that determine how likely AI engines are to cite your business:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <Card className="bg-slate-900/50 border-slate-700 p-5">
                <h4 className="font-bold text-cyan-400 mb-2">Content Quality (40%)</h4>
                <p className="text-sm text-slate-400">Word count, heading hierarchy, image alt text coverage, and internal linking structure. AI engines prefer well-structured, comprehensive content.</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-700 p-5">
                <h4 className="font-bold text-cyan-400 mb-2">Technical SEO (25%)</h4>
                <p className="text-sm text-slate-400">Meta titles, descriptions, HTTPS, canonical tags, viewport configuration, and indexability. The foundation that allows AI crawlers to access your content.</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-700 p-5">
                <h4 className="font-bold text-cyan-400 mb-2">Authority (20%)</h4>
                <p className="text-sm text-slate-400">JSON-LD structured data, schema type richness, and outbound citations. AI engines use entity recognition to determine if your business is a credible source.</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-700 p-5">
                <h4 className="font-bold text-cyan-400 mb-2">Chat Visibility (15%)</h4>
                <p className="text-sm text-slate-400">FAQ schema, HowTo markup, concise answer paragraphs (40-60 words), and question-based headings. These are the exact formats AI engines extract for direct answers.</p>
              </Card>
            </div>

            <h3 className="text-2xl font-bold text-cyan-400 mt-8">What is a Good AEO Score?</h3>
            <p>
              Scores range from 0 to 10. A score below 3 means AI engines are likely ignoring your business entirely. Scores between 3-5 indicate low visibility with significant room for improvement. Scores of 5-7 show moderate presence — you're being considered but not consistently recommended. Scores above 7 indicate strong AI visibility, and above 8.5 represents what we call "Agentic Dominance" — your business is the go-to recommendation.
            </p>

            <h3 className="text-2xl font-bold text-cyan-400 mt-8">How to Improve Your AEO Score</h3>
            <p>
              After running your free diagnostic, follow the specific recommendations provided. Common improvements include adding JSON-LD schema markup (Organization, FAQ, HowTo), writing concise answer paragraphs that AI can extract directly, structuring content with question-based headings, and ensuring all technical SEO fundamentals are in place.
            </p>
            <p>
              For businesses that need professional help, our team offers comprehensive AEO audits and implementation services. But the free tool gives you everything you need to start improving today.
            </p>
          </div>

          {/* CTA back to tool */}
          <div className="text-center mt-12">
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-neon text-lg px-8 py-3">
              <ArrowRight className="w-5 h-5 mr-2" /> Check Your Score Now — It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SERVICE TIERS: Reduced presence, below educational     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-12 border-t border-slate-800 bg-slate-900/30">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Need Expert Help?</h2>
            <p className="text-slate-400">Our team can fix your AEO score for you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-1">Agentic Growth</h3>
              <div className="text-2xl font-bold text-cyan-400 mb-3">$1,500<span className="text-sm text-slate-400">/mo</span></div>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>Real-time AI trend monitoring</li>
                <li>Monthly AEO content strategy</li>
                <li>Schema markup implementation</li>
              </ul>
              <a href="https://ko-fi.com/aheadoftrendsautomatedaiagents" target="_blank" rel="noopener noreferrer">
                <Button className="w-full btn-neon">Get Started</Button>
              </a>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-1">Full-Stack AEO</h3>
              <div className="text-2xl font-bold text-cyan-400 mb-3">$3,500<span className="text-sm text-slate-400">/mo</span></div>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>Everything in Agentic Growth</li>
                <li>Full website AEO overhaul</li>
                <li>Competitor displacement strategy</li>
              </ul>
              <a href="https://ko-fi.com/aheadoftrendsautomatedaiagents" target="_blank" rel="noopener noreferrer">
                <Button className="w-full btn-neon">Get Started</Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Ahead of Trends. The internet's only free, instant AEO diagnostic tool.</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/blog"><span className="hover:text-cyan-400 cursor-pointer">Blog</span></Link>
            <Link href="/guides"><span className="hover:text-cyan-400 cursor-pointer">Guides</span></Link>
            <Link href="/about"><span className="hover:text-cyan-400 cursor-pointer">About</span></Link>
            <Link href="/privacy"><span className="hover:text-cyan-400 cursor-pointer">Privacy</span></Link>
            <Link href="/terms"><span className="hover:text-cyan-400 cursor-pointer">Terms</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
