import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle, Loader2, ExternalLink, Zap, Shield, BarChart3, Eye } from 'lucide-react';
import { Link } from 'wouter';


interface AeoScoreBreakdown {
  contentQuality: number;
  technicalSeo: number;
  authority: number;
  chatVisibility: number;
  overall: number;
  recommendations?: string[];
  status?: string;
}

export default function AlphaRating() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<AeoScoreBreakdown | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);



  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalize URL
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      // Call the AEO scoring engine
      const response = await fetch('/api/trpc/aeo.analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { url: normalizedUrl } }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.result?.data) {
          setScore(data.result.data);
          setRecommendations(data.result.data.recommendations || []);
          setAnalysisError(null);
        } else {
          setAnalysisError('Could not parse response. Please try again.');
          return;
        }
      } else {
        const errData = await response.json().catch(() => null);
        setAnalysisError(errData?.error?.message || 'Failed to analyze. The site may block crawlers.');
        return;
      }
      setStep(2);
    } catch (err: any) {
      setAnalysisError('Network error. Please check the URL and try again.');
      return;
    } finally {
      setLoading(false);
    }
  };

  // No fallback — we only show real data, never fabricated scores

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('/api/trpc/aeo.saveAnalysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { email, url, score: score?.overall ?? 0 } }),
      });
      setStep(3);
    } catch {
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (val: number) => val >= 70 ? 'text-emerald-400' : val >= 40 ? 'text-amber-400' : 'text-red-400';
  const getBarColor = (val: number) => val >= 70 ? 'from-emerald-500 to-cyan-500' : val >= 40 ? 'from-amber-500 to-yellow-500' : 'from-red-500 to-pink-500';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back</span>
            </div>
          </Link>
          <h1 className="text-lg font-bold">AEO Alpha-Rating Calculator</h1>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container py-12">
        {/* Step 1: URL Input */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Discover Your <span className="text-cyan-400">Agentic Dominance</span> Score</h2>
              <p className="text-slate-400 text-lg">Enter your business URL to get a 0-10 rating showing where AI Chat Engines rank you vs competitors.</p>
            </div>

            <Card className="bg-slate-900/50 border-slate-700 p-8">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div>
                  <Label htmlFor="url" className="text-slate-300 font-semibold">Your Business URL</Label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="https://yourcompany.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500 mt-2 h-12 text-lg"
                    required
                  />
                  <p className="text-slate-500 text-sm mt-2">Example: caymanmarlroad.com</p>
                  {analysisError && (
                    <p className="text-red-400 text-sm mt-2 bg-red-500/10 border border-red-500/30 rounded p-3">{analysisError}</p>
                  )}
                </div>

                <Button type="submit" className="btn-neon w-full h-12 text-lg" disabled={!url || loading}>
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing with 4-Factor AEO Engine...</>
                  ) : (
                    <><Zap className="w-5 h-5 mr-2" /> Calculate My Alpha-Rating</>
                  )}
                </Button>
              </form>

              {/* Trust indicators */}
              <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-3 gap-4 text-center text-xs text-slate-500">
                <div><Shield className="w-4 h-4 mx-auto mb-1 text-cyan-500" />Free Analysis</div>
                <div><BarChart3 className="w-4 h-4 mx-auto mb-1 text-cyan-500" />4-Factor Score</div>
                <div><Eye className="w-4 h-4 mx-auto mb-1 text-cyan-500" />AI Visibility</div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Score Display */}
        {step === 2 && score !== null && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Your AEO Alpha-Rating</h2>
              <p className="text-slate-400">4-Factor competitive gap analysis for <span className="text-cyan-400">{url}</span></p>
            </div>

            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/50 p-12 mb-8">
              <div className="text-center">
                <p className="text-slate-400 mb-4 uppercase tracking-wider text-sm">Agentic Dominance Score</p>
                <div className="text-8xl font-bold text-cyan-400 mb-4">{score.overall}<span className="text-3xl text-slate-500">/10</span></div>
                <p className="text-slate-300 text-lg">
                  {score.overall >= 8 ? 'Excellent — You\'re dominating AI Chat Engines' :
                   score.overall >= 6 ? 'Good — Room for strategic improvement' :
                   score.overall >= 4 ? 'Moderate — Significant competitive gap' :
                   'Critical — AI engines are ignoring your brand'}
                </p>
              </div>
            </Card>

            {/* 4-Factor Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Content Quality', value: score.contentQuality, weight: '40%', icon: BarChart3 },
                { label: 'Technical SEO', value: score.technicalSeo, weight: '25%', icon: Shield },
                { label: 'Authority', value: score.authority, weight: '20%', icon: Zap },
                { label: 'Chat Visibility', value: score.chatVisibility, weight: '15%', icon: Eye },
              ].map((factor) => (
                <Card key={factor.label} className="bg-slate-900/50 border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <factor.icon className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-bold">{factor.label}</h3>
                    </div>
                    <span className="text-xs text-slate-500">Weight: {factor.weight}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Score</span>
                    <span className={`font-bold ${getScoreColor(factor.value)}`}>{factor.value}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${getBarColor(factor.value)} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${factor.value}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-700 p-8 mb-8">
                <h3 className="font-bold text-lg mb-4 text-cyan-400">Specific Findings & Recommendations</h3>
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="text-cyan-400 mt-0.5 shrink-0">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Lead Capture + Ko-fi CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free: Email capture */}
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/50 p-8">
                <h3 className="font-bold text-lg mb-2">Free Visibility Report</h3>
                <p className="text-slate-400 text-sm mb-4">Get your detailed results emailed with improvement recommendations.</p>
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                    required
                  />
                  <Button type="submit" className="btn-neon w-full" disabled={submitting || !email}>
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Mail className="w-4 h-4 mr-2" /> Send Free Report</>}
                  </Button>
                </form>
              </Card>

              {/* Paid: Full Audit via Ko-fi */}
              <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/50 p-8">
                <h3 className="font-bold text-lg mb-2">Full AEO Audit</h3>
                <p className="text-slate-400 text-sm mb-4">Get a comprehensive audit with personalized action plan from our Agentic team.</p>
                <ul className="text-sm text-slate-300 space-y-2 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400" /> Deep-dive 4-factor analysis</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400" /> Competitor comparison report</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400" /> 30-day action plan</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-pink-400" /> 1-on-1 strategy call</li>
                </ul>
                <a href="https://ko-fi.com/aheadoftrendsautomatedaiagents" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold">
                    <ExternalLink className="w-4 h-4 mr-2" /> Request Full Audit
                  </Button>
                </a>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-cyan-500/20 border-2 border-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Results Sent!</h2>
              <p className="text-slate-400 text-lg mb-4">
                Your AEO Alpha-Rating report has been queued for <strong className="text-cyan-400">{email}</strong>.
              </p>
              <p className="text-slate-400 mb-8">
                Our Agentic team will review your competitive gap and reach out within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button className="btn-neon">Back to Home</Button>
                </Link>
                <Link href="/guides">
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                    Read Our Guides
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
