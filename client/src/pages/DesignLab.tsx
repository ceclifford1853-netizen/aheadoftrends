import { useState, Suspense, lazy } from 'react';
import { Zap, Loader2, CheckCircle, BarChart3, Shield, Eye } from 'lucide-react';
import { Link } from 'wouter';

const PlanetaryHorizon  = lazy(() => import('@/components/scenes/PlanetaryHorizon'));
const DataPeakTopography = lazy(() => import('@/components/scenes/DataPeakTopography'));
const NeuralSynapse     = lazy(() => import('@/components/scenes/NeuralSynapse'));
const DigitalRain       = lazy(() => import('@/components/scenes/DigitalRain'));

const THEMES = [
  {
    id: 'planetary',
    label: '🌍 Planetary Horizon',
    desc: 'Satellite View — deep cyan, city lights, curved earth',
    accent: '#00d9ff',
    bg: 'rgba(0,10,18,0.92)',
    Scene: PlanetaryHorizon,
  },
  {
    id: 'datapeak',
    label: '⛰ Data Peak',
    desc: 'Digital Terrain — magenta wireframe mountains',
    accent: '#ff00cc',
    bg: 'rgba(5,0,8,0.92)',
    Scene: DataPeakTopography,
  },
  {
    id: 'neural',
    label: '🧠 Neural Synapse',
    desc: 'AI Intelligence — glowing nodes, navy/violet',
    accent: '#9933ff',
    bg: 'rgba(2,0,16,0.92)',
    Scene: NeuralSynapse,
  },
  {
    id: 'digitalrain',
    label: '💻 Digital Rain',
    desc: 'High Velocity — cyan/pink binary streams',
    accent: '#00ffff',
    bg: 'rgba(0,4,4,0.92)',
    Scene: DigitalRain,
  },
] as const;

type ThemeId = typeof THEMES[number]['id'];

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

function getColor(score: number, accent: string) {
  if (score >= 70) return accent;
  if (score >= 40) return '#ff9500';
  return '#ff007f';
}

export default function DesignLab() {
  const [activeId, setActiveId] = useState<ThemeId>('planetary');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AeoResult | null>(null);
  const [error, setError] = useState('');

  const theme = THEMES.find(t => t.id === activeId)!;
  const { Scene, accent, bg } = theme;

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(''); setResult(null);
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
      setError((e as Error).message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#020408', minHeight: '100vh', color: '#e0f7ff', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

      {/* HEADER */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(2,4,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', fontWeight: 700 }}>Design Lab</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>— Visual Staging Environment</span>
        </div>
        <Link href="/" style={{ fontSize: '0.75rem', color: 'rgba(224,247,255,0.5)', textDecoration: 'none' }}>← Back to Live Site</Link>
      </nav>

      {/* THEME SWITCHER — fixed left rail */}
      <div style={{ position: 'fixed', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveId(t.id); setResult(null); setError(''); }}
            title={t.desc}
            style={{
              background: activeId === t.id ? `rgba(${t.accent === '#00d9ff' ? '0,217,255' : t.accent === '#ff00cc' ? '255,0,204' : t.accent === '#9933ff' ? '153,51,255' : '0,255,255'},0.15)` : 'rgba(0,0,0,0.5)',
              border: `1px solid ${activeId === t.id ? t.accent : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              color: activeId === t.id ? t.accent : 'rgba(255,255,255,0.4)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '160px',
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{t.label}</div>
            <div style={{ fontSize: '0.6rem', opacity: 0.7, lineHeight: 1.3 }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* 3D SCENE BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Suspense fallback={<div style={{ background: '#020408', width: '100%', height: '100%' }} />}>
          <Scene />
        </Suspense>
      </div>

      {/* THEME LABEL — bottom left */}
      <div style={{ position: 'fixed', bottom: '1.5rem', left: '1rem', zIndex: 200, background: 'rgba(0,0,0,0.6)', border: `1px solid ${accent}`, borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.7rem', color: accent, letterSpacing: '0.1em', backdropFilter: 'blur(8px)' }}>
        VARIANT: {theme.label.toUpperCase()}
      </div>

      {/* MAIN CONTENT — centered AEO tool */}
      <div style={{ position: 'relative', zIndex: 100, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '52px', paddingLeft: '180px' }}>
        <div style={{ width: '100%', maxWidth: '620px', padding: '0 1.5rem' }}>

          {/* Glassmorphism AEO Tool */}
          <div style={{
            background: 'rgba(0,0,0,0.80)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${accent}33`,
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: `0 0 60px ${accent}15, 0 0 120px rgba(0,0,0,0.8)`,
          }}>
            {/* HUD badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ width: '6px', height: '6px', background: accent, borderRadius: '50%', animation: 'pulse 2s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: accent, textTransform: 'uppercase' }}>AEO Diagnostic Engine — Online</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#fff' }}>Free </span>
              <span style={{ color: accent, textShadow: `0 0 20px ${accent}` }}>AEO Score</span>
              <span style={{ color: '#fff' }}> Checker</span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'rgba(224,247,255,0.55)', marginBottom: '1.25rem' }}>
              No signup. Instant results. Real DOM analysis — zero hallucinations.
            </p>

            {/* Search input */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyze()}
                placeholder="yourcompany.com"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}33`, borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#e0f7ff', fontSize: '0.9rem', outline: 'none' }}
              />
              <button
                onClick={analyze}
                disabled={loading}
                style={{ background: loading ? 'rgba(0,0,0,0.4)' : accent, border: 'none', borderRadius: '8px', padding: '0.65rem 1.25rem', color: '#000', fontWeight: 800, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
              >
                {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: accent }} /> : <Zap size={14} />}
                {loading ? 'Scanning...' : 'Analyze'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.65rem', color: 'rgba(224,247,255,0.4)', marginBottom: '1rem' }}>
              {['100% Free', 'Instant', '4-Factor', 'No Signup'].map(tag => (
                <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={10} style={{ color: accent }} /> {tag}
                </span>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(255,0,127,0.1)', border: '1px solid rgba(255,0,127,0.3)', borderRadius: '6px', padding: '0.6rem 0.8rem', color: '#ff007f', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div style={{ borderTop: `1px solid ${accent}22`, paddingTop: '1.25rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(224,247,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{result.analysis.url}</p>
                  <div style={{ fontSize: '3.5rem', fontWeight: 900, color: accent, textShadow: `0 0 30px ${accent}`, lineHeight: 1 }}>
                    {result.scores.overall}<span style={{ fontSize: '1.2rem', color: 'rgba(224,247,255,0.4)' }}>/10</span>
                  </div>
                  <div style={{ display: 'inline-block', background: `${accent}18`, border: `1px solid ${accent}44`, borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.7rem', color: accent, marginTop: '0.4rem' }}>
                    {result.statusLabel}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Content Quality', value: result.scores.contentQuality, icon: <BarChart3 size={11} /> },
                    { label: 'Technical SEO', value: result.scores.technicalSeo, icon: <Shield size={11} /> },
                    { label: 'Authority', value: result.scores.authority, icon: <Zap size={11} /> },
                    { label: 'Chat Visibility', value: result.scores.chatVisibility, icon: <Eye size={11} /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}18`, borderRadius: '6px', padding: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'rgba(224,247,255,0.6)' }}>{icon}{label}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: getColor(value, accent) }}>{value}</span>
                      </div>
                      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${value}%`, background: getColor(value, accent), borderRadius: '2px', boxShadow: `0 0 6px ${getColor(value, accent)}` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {result.recommendations.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#ff007f', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Top Fixes</p>
                    <ol style={{ paddingLeft: '1rem', margin: 0 }}>
                      {result.recommendations.slice(0, 3).map((r, i) => (
                        <li key={i} style={{ fontSize: '0.75rem', color: 'rgba(224,247,255,0.65)', marginBottom: '0.3rem', lineHeight: 1.5 }}>{r}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Variant label under tool */}
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.65rem', color: 'rgba(224,247,255,0.25)', letterSpacing: '0.1em' }}>
            DESIGN LAB — STAGING ONLY — NOT LIVE
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input::placeholder { color: rgba(224,247,255,0.25); }
        input:focus { border-color: ${accent}88 !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
