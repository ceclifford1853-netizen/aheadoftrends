import { useState, Suspense, lazy } from 'react';
import { Zap, Shield, BarChart3, Eye, Loader2, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

const GlobeScene = lazy(() => import('@/components/GlobeScene'));

const BRAND_LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/InShot_20260318_204525602_99f03f11.png';

interface AeoScores {
  contentQuality: number;
  technicalSeo: number;
  authority: number;
  chatVisibility: number;
  overall: number;
}

interface AeoResult {
  scores: AeoScores;
  recommendations: string[];
  statusLabel: string;
  analysis: { title: string; url: string };
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#00ffff';
  if (score >= 40) return '#ff9500';
  return '#ff007f';
}

function getOverallColor(score: number): string {
  if (score >= 7) return '#00ffff';
  if (score >= 4) return '#ff9500';
  return '#ff007f';
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AeoResult | null>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let target = url.trim();
      if (!target.startsWith('http')) target = 'https://' + target;
      const res = await fetch('/api/aeo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      setError((e as Error).message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#050a0f', minHeight: '100vh', color: '#e0f7ff', fontFamily: "'Inter', sans-serif" }}>

    {/* ── HERO — 3D COCKPIT (globe section) ── */}
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '40%',               // push content down below logo
      overflow: 'hidden',
    }}>

      {/* ── BRAND LOGO — absolutely positioned at top, globe animation flows behind ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 2,
        lineHeight: 0,
        pointerEvents: 'none',
      }}>
        <img
          src={BRAND_LOGO_URL}
          alt="Ahead of Trends Ai"
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Three.js Globe Background — dimmed by 12% via overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <GlobeScene />
        </Suspense>
      </div>

      {/* ── GLOBE DIMMER OVERLAY — adds ~12% opacity dark layer ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(5, 10, 15, 0.12)',   // 12% dark = slight dim. Increase to 0.20 for more.
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Cockpit HUD overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center top, rgba(0,255,255,0.05) 0%, transparent 70%), radial-gradient(ellipse at center bottom, rgba(255,0,127,0.08) 0%, transparent 60%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 1.5rem' }}>

        {/* HUD badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '20px', padding: '0.3rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#00ffff', textTransform: 'uppercase' }}>
          <span style={{ width: '6px', height: '6px', background: '#00ffff', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          AEO Diagnostic Engine — Online
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Free <span style={{ color: '#00ffff' }}>AEO Score</span> Checker
        </h1>

        <p style={{ fontSize: '1.125rem', color: 'rgba(224,247,255,0.8)', marginBottom: '0.5rem', lineHeight: 1.6 }}>
          The internet's only <span style={{ color: '#ff1080', fontWeight: 600 }}>instant, one-click</span> AI Engine Optimization diagnostic.
        </p>

        <p style={{ fontSize: '0.875rem', color: 'rgba(224,247,255,0.6)', marginBottom: '2rem', lineHeight: 1.6 }}>
          No signup. No payment. Enter your URL and get your score in seconds.
        </p>

          {/* SEARCH INPUT — PRIMARY FOCUS */}
          <div style={{ background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '12px', padding: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem', boxShadow: '0 0 40px rgba(0,255,255,0.1)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyze()}
                placeholder="yourcompany.com"
                style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#e0f7ff', fontSize: '1rem', outline: 'none' }}
              />
              <button
  onClick={analyze}
  disabled={loading}
  style={{
    position: 'relative',
    padding: '0.85rem 2rem',
    borderRadius: '0.6rem',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.06em',
    color: '#fff',
    background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 50%, #00F2FE 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 3s ease infinite, glowBreathe 2.5s ease-in-out infinite',
    boxShadow: '0 0 12px rgba(0,210,255,0.6), 0 0 30px rgba(0,210,255,0.3)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  }}
  onMouseEnter={e => {
    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,210,255,0.9), 0 0 50px rgba(0,210,255,0.5)';
  }}
  onMouseLeave={e => {
    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(0,210,255,0.6), 0 0 30px rgba(0,210,255,0.3)';
  }}
>
  {/* Shimmer sweep overlay */}
  <span style={{
    position: 'absolute',
    inset: 0,
    borderRadius: '0.6rem',
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
    backgroundSize: '200% 100%',
    animation: 'shimmerSweep 3.5s ease-in-out infinite',
    pointerEvents: 'none',
  }} />
  <Zap size={17} color="#fff" strokeWidth={2.5} />
  {loading ? 'Analyzing...' : 'Analyze Now'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(224,247,255,0.5)' }}>
              {['100% Free', 'Instant Results', '4-Factor Score', 'No Signup'].map(tag => (
                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle size={12} style={{ color: '#00ffff' }} /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div style={{ background: 'rgba(255,0,127,0.1)', border: '1px solid rgba(255,0,127,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#ff007f', fontSize: '0.875rem', maxWidth: '600px', margin: '0 auto 1rem' }}>
              {error}
            </div>
          )}

          {/* RESULTS */}
          {result && (
            <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '12px', padding: '2rem', maxWidth: '700px', margin: '0 auto', textAlign: 'left', backdropFilter: 'blur(10px)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'rgba(224,247,255,0.5)', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your AEO Score — {result.analysis.url}</p>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: getOverallColor(result.scores.overall), textShadow: `0 0 30px ${getOverallColor(result.scores.overall)}` }}>
                  {result.scores.overall}<span style={{ fontSize: '1.5rem', color: 'rgba(224,247,255,0.5)' }}>/10</span>
                </div>
                <div style={{ display: 'inline-block', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '20px', padding: '0.3rem 1rem', fontSize: '0.8rem', color: '#00ffff', marginTop: '0.5rem' }}>
                  {result.statusLabel}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Content Quality', value: result.scores.contentQuality, icon: <BarChart3 size={14} /> },
                  { label: 'Technical SEO', value: result.scores.technicalSeo, icon: <Shield size={14} /> },
                  { label: 'Authority', value: result.scores.authority, icon: <Zap size={14} /> },
                  { label: 'Chat Visibility', value: result.scores.chatVisibility, icon: <Eye size={14} /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.1)', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(224,247,255,0.7)' }}>{icon}{label}</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: getScoreColor(value) }}>{value}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${value}%`, background: getScoreColor(value), borderRadius: '2px', boxShadow: `0 0 8px ${getScoreColor(value)}` }} />
                    </div>
                  </div>
                ))}
              </div>

              {result.recommendations.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: '#ff007f', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What to Fix</h3>
                  <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {result.recommendations.map((rec, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: 'rgba(224,247,255,0.75)', marginBottom: '0.4rem', lineHeight: 1.5 }}>{rec}</li>
                    ))}
                  </ol>
                </div>
              )}


            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{ background: '#070d12', padding: '4rem 2rem', borderTop: '1px solid rgba(0,255,255,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '20px', padding: '0.3rem 1rem', marginBottom: '1rem', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#00ffff', textTransform: 'uppercase' }}>
            Agentic Dominance Framework
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
            How to Check Your <span style={{ color: '#00ffff' }}>AEO Score</span>
          </h2>
          <p style={{ color: 'rgba(224,247,255,0.5)', fontSize: '0.9rem', marginBottom: '3rem' }}>
            Four steps. Thirty seconds. No excuses.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Enter Your URL', desc: 'Type any website address into the diagnostic field. No account needed.' },
              { step: '02', title: 'Hit Analyze Now', desc: 'Our engine crawls your site across 4 AI-readiness factors instantly.' },
              { step: '03', title: 'Read Your Score', desc: 'Get a 0–10 score across Content Quality, Technical SEO, Authority, and Chat Visibility.' },
              { step: '04', title: 'Dominate or Fix', desc: 'Follow the What to Fix list — or hire us to achieve Agentic Dominance for you.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', textAlign: 'left', position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(0,255,255,0.12)', lineHeight: 1, marginBottom: '0.75rem' }}>{step}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e0f7ff', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(224,247,255,0.55)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES — AdSense grounding */}
      <section style={{ background: '#070d12', padding: '5rem 2rem', borderTop: '1px solid rgba(0,255,255,0.1)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#00ffff', marginBottom: '1rem', textAlign: 'center' }}>What is AEO (AI Engine Optimization)?</h2>
          <p style={{ color: 'rgba(224,247,255,0.7)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            <strong style={{ color: '#e0f7ff' }}>AI Engine Optimization (AEO)</strong> is the discipline of structuring your website's content, metadata, and semantic markup so that AI-powered conversational engines — including ChatGPT, Google Gemini, Perplexity AI, Claude, and Microsoft Copilot — can accurately discover, understand, and recommend your business to users. Unlike traditional Search Engine Optimization (SEO), which targets ranked lists of links, AEO targets the answer layer: the single, direct response an AI assistant delivers when a user asks a question.
          </p>
          <p style={{ color: 'rgba(224,247,255,0.7)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            The shift from "search and browse" to "ask and receive" is accelerating. Over 40% of Gen Z users now prefer asking AI assistants over using Google Search for product and service discovery. Enterprise procurement teams increasingly rely on AI-generated vendor summaries. If your business is not optimized for the AI answer layer, you are invisible to a rapidly growing segment of your potential customers — often without realizing it.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ff007f', marginBottom: '0.75rem', marginTop: '2rem' }}>The Four Pillars of AEO</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: <BarChart3 size={20} />, title: 'Content Quality (40%)', desc: 'Word count, heading hierarchy (H1→H2→H3), image alt text coverage, and internal linking density. AI engines prefer comprehensive, well-structured content with clear topical authority.' },
              { icon: <Shield size={20} />, title: 'Technical SEO (25%)', desc: 'Meta titles (30-60 chars), meta descriptions (120-160 chars), HTTPS, canonical tags, viewport configuration, and crawl accessibility. The technical foundation that allows AI crawlers to access and index your content.' },
              { icon: <Zap size={20} />, title: 'Authority (20%)', desc: 'JSON-LD structured data (Organization, Article, Product, LocalBusiness), schema type richness, and outbound citations to authoritative sources. AI engines use entity recognition to determine if your business is a credible, citable source.' },
              { icon: <Eye size={20} />, title: 'Chat Visibility (15%)', desc: 'FAQPage schema, HowTo markup, concise answer paragraphs (40-60 words), and question-based headings (What/How/Why). These are the exact content formats that AI engines extract for direct conversational answers.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.1)', borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ color: '#00ffff', marginBottom: '0.5rem' }}>{icon}</div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e0f7ff', marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'rgba(224,247,255,0.6)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ff007f', marginBottom: '0.75rem' }}>What is a Good AEO Score?</h3>
          <p style={{ color: 'rgba(224,247,255,0.7)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Our diagnostic scores websites on a 0-10 scale. A score below 3 indicates that AI engines are likely ignoring your business entirely — your content is either inaccessible, too thin, or structurally incompatible with AI extraction. Scores between 3-5 represent Low Visibility: you have a basic web presence but significant structural gaps prevent consistent AI recommendation. Scores of 5-7 indicate Moderate Presence — your business is being considered by AI engines but not consistently recommended. Scores above 7 indicate Strong Visibility, and a score above 8.5 represents what we call Agentic Dominance: your business is the go-to recommendation when users ask AI assistants about your category.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ff007f', marginBottom: '0.75rem' }}>How to Improve Your AEO Score</h3>
          <p style={{ color: 'rgba(224,247,255,0.7)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            The most impactful single improvement for most websites is implementing JSON-LD structured data. Adding an Organization schema with your business name, description, URL, logo, and contact information gives AI engines a machine-readable identity card for your business. The second highest-impact change is adding FAQPage schema to your key service pages — this directly feeds the question-and-answer format that AI assistants use for conversational responses. Third, restructure your content to include concise answer paragraphs of 40-60 words that directly answer common questions about your business, product, or service. AI engines extract these self-contained blocks for direct answers.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ff007f', marginBottom: '0.75rem' }}>Why AEO Matters More Than SEO in 2025</h3>
          <p style={{ color: 'rgba(224,247,255,0.7)', lineHeight: 1.8, marginBottom: '2rem' }}>
            Traditional SEO optimizes for a list of ten blue links. A user clicks one, browses, and may or may not convert. AEO optimizes for a single, authoritative recommendation delivered directly in a conversational interface. When a user asks "What's the best project management tool for remote teams?" and an AI assistant recommends your product by name, that is a zero-click conversion event — the user already trusts the recommendation before visiting your site. The businesses that dominate AI recommendations in 2025 will own their category for the next decade. The window to establish that dominance is open now, and it closes as AI-optimized competitors enter every market.
          </p>

          {/* CTA repeat */}
          <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '12px' }}>
            <h3 style={{ color: '#00ffff', marginBottom: '0.5rem' }}>Check Your Score Now — It's Free</h3>
            <p style={{ color: 'rgba(224,247,255,0.6)', fontSize: '0.875rem', marginBottom: '1rem' }}>No signup. No payment. Instant results.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'linear-gradient(135deg, #00ffff, #0088cc)', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', color: '#050a0f', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRight size={16} /> Analyze My Website
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES — reduced presence */}
      <section style={{ background: '#050a0f', padding: '4rem 2rem', borderTop: '1px solid rgba(255,0,127,0.1)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(224,247,255,0.6)', marginBottom: '0.5rem' }}>Need Expert Help?</h2>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: '0.875rem', marginBottom: '2rem' }}>Our team can implement your AEO improvements for you.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Agentic Growth', price: '$1,500/mo', features: ['Real-time AI trend monitoring', 'Monthly AEO content strategy', 'Schema markup implementation'] },
              { name: 'Full-Stack AEO', price: '$3,500/mo', features: ['Everything in Agentic Growth', 'Full website AEO overhaul', 'Competitor displacement strategy'] },
            ].map(tier => (
              <div key={tier.name} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,255,255,0.1)', borderRadius: '8px', padding: '1.5rem', textAlign: 'left' }}>
                <h3 style={{ color: '#00ffff', marginBottom: '0.25rem', fontSize: '1rem' }}>{tier.name}</h3>
                <p style={{ color: '#ff007f', fontWeight: 700, marginBottom: '1rem', fontSize: '1.25rem' }}>{tier.price}</p>
                <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1rem' }}>
                  {tier.features.map(f => <li key={f} style={{ color: 'rgba(224,247,255,0.6)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>{f}</li>)}
                </ul>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ width: '100%', display: 'block', textAlign: 'center', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '6px', padding: '0.5rem', color: '#00ffff', textDecoration: 'none', fontSize: '0.875rem', cursor: 'pointer' }}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#030608', borderTop: '1px solid rgba(0,255,255,0.08)', padding: '2rem', textAlign: 'center' }}>
        <img src={BRAND_LOGO_URL} alt="Ahead of Trends AI" style={{ height: '32px', objectFit: 'contain', marginBottom: '1rem', opacity: 0.7 }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
          {[
            { label: 'Blog', path: '/blog' },
            { label: 'Guides', path: '/guides' },
            { label: 'About', path: '/about-us' },
            { label: 'Privacy', path: '/privacy-policy' },
            { label: 'Terms', path: '/terms-of-service' },
          ].map(item => (
            <Link key={item.label} href={item.path} style={{ color: 'rgba(224,247,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>{item.label}</Link>
          ))}
        </div>
        <p style={{ color: 'rgba(224,247,255,0.3)', fontSize: '0.75rem' }}>© 2025 Ahead of Trends AI. The internet's only free, instant AEO diagnostic.</p>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input::placeholder { color: rgba(224,247,255,0.3); }
        input:focus { border-color: rgba(0,255,255,0.5) !important; box-shadow: 0 0 0 2px rgba(0,255,255,0.1); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
