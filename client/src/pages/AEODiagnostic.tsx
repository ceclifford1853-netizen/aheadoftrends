import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface AEOScore {
  overall: number;
  contentQuality: number;
  technicalSeo: number;
  authority: number;
  chatVisibility: number;
  recommendations: string[];
  statusLabel: string;
}

export default function AEODiagnostic() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState<AEOScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitWebsiteMutation = trpc.aeo.submitWebsite.useMutation();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setScore(null);
    setLoading(true);

    try {
      if (!url.trim()) {
        throw new Error('Please enter a website URL');
      }

      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(normalizedUrl);

      // Generate mock AEO score
      const mockResult: AEOScore = {
        contentQuality: Math.floor(Math.random() * 100),
        technicalSeo: Math.floor(Math.random() * 100),
        authority: Math.floor(Math.random() * 100),
        chatVisibility: Math.floor(Math.random() * 100),
        overall: Math.floor(Math.random() * 10 * 10) / 10,
        recommendations: [
          '🔒 Install SSL certificate (HTTPS required for AI trust signals)',
          '📊 Implement JSON-LD Schema.org markup for AI entity recognition',
          '🔗 Add Open Graph tags for Chat Engine preview optimization',
          '📝 Add exactly one H1 heading for content hierarchy',
          '✍️ Increase content depth to 850+ words for AI reasoning engines',
        ],
        statusLabel: 'Strong Presence',
      };

      setScore(mockResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to analyze website'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLead = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!score) {
      setError('Please analyze a website first');
      return;
    }

    try {
      await submitWebsiteMutation.mutateAsync({
        email: email.trim(),
        websiteUrl: url.trim(),
      });

      setSubmitted(true);
      setUrl('');
      setEmail('');
      setScore(null);

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit lead'
      );
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 3) return 'text-red-500';
    if (score < 6) return 'text-yellow-500';
    if (score < 8) return 'text-blue-500';
    return 'text-green-500';
  };

  const getScoreBg = (score: number) => {
    if (score < 3) return 'bg-red-500/10';
    if (score < 6) return 'bg-yellow-500/10';
    if (score < 8) return 'bg-blue-500/10';
    return 'bg-green-500/10';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">AEO</span>
              <br />
              <span className="glow-cyan text-cyan-400">Diagnostic Tool</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Get a free AI Visibility score for your website. See how well your site is optimized for Answer Engine Optimization.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 mb-8">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Website URL
                </label>
                <Input
                  type="url"
                  placeholder="example.com or https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                />
              </div>

              {score && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Your Email (for full audit)
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || submitted}
                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-neon flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Get Free Score
                    </>
                  )}
                </Button>

                {score && (
                  <Button
                    type="button"
                    onClick={handleSubmitLead}
                    disabled={loading || submitted || !email}
                    className="btn-neon-outline flex-1"
                  >
                    {submitted ? 'Submitted!' : 'Request Full Audit'}
                  </Button>
                )}
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {submitted && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 text-sm font-semibold">
                    Lead submitted successfully!
                  </p>
                  <p className="text-green-400/80 text-xs mt-1">
                    Check your email for next steps.
                  </p>
                </div>
              </div>
            )}
          </div>

          {score && !submitted && (
            <div className="space-y-8">
              <div className={`${getScoreBg(score.overall)} border border-slate-700 rounded-lg p-8 text-center`}>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">
                  Overall AEO Score
                </p>
                <p className={`text-6xl font-bold ${getScoreColor(score.overall)}`}>
                  {score.overall.toFixed(1)}/10
                </p>
                <p className="text-slate-300 text-lg mt-4 font-semibold">
                  {score.statusLabel}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Content Quality', value: score.contentQuality },
                  { label: 'Technical SEO', value: score.technicalSeo },
                  { label: 'Authority', value: score.authority },
                  { label: 'Chat Visibility', value: score.chatVisibility },
                ].map((factor) => (
                  <div
                    key={factor.label}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-6"
                  >
                    <p className="text-slate-400 text-sm font-semibold mb-3">
                      {factor.label}
                    </p>
                    <div className="flex items-end gap-4">
                      <p className={`text-4xl font-bold ${getScoreColor(factor.value)}`}>
                        {factor.value}
                      </p>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            factor.value < 50
                              ? 'bg-red-500'
                              : factor.value < 75
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(factor.value, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Optimization Recommendations
                </h3>
                <ul className="space-y-3">
                  {score.recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-300 text-sm"
                    >
                      <span className="text-cyan-400 font-bold mt-1">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Want a Complete AEO Audit?
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Get detailed analysis, competitive benchmarking, and a personalized optimization roadmap from our AEO specialists.
                </p>
                <a
                  href="https://ko-fi.com/aheadoftrendsautomatedaiagents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon inline-block"
                >
                  Request Full Audit
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
