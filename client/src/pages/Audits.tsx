import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Audits() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back</span>
            </div>
          </Link>
          <h1 className="text-lg font-bold">Agentic Audits</h1>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Your Agentic Audit</h1>
          <p className="text-lg text-slate-300 mb-12">
            Based on your AEO Alpha-Rating, here's your personalized action plan to dominate AI Chat Engines.
          </p>

          <div className="space-y-6 mb-12">
            <Card className="bento-card">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Phase 1: Content Authority (Weeks 1-4)</h3>
                  <p className="text-slate-400 mb-3">Build your technical content foundation with 5 high-authority guides (850+ words each) targeting your highest-intent AEO keywords.</p>
                  <ul className="text-sm text-slate-400 space-y-1 ml-4">
                    <li>• Scout Agent identifies top 5 AEO keywords</li>
                    <li>• Architect Agent structures content for EEAT signals</li>
                    <li>• Ghostwriter Agent executes technical guides</li>
                    <li>• Auditor Agent verifies AI-readiness</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bento-card">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Phase 2: Distribution & Amplification (Weeks 5-8)</h3>
                  <p className="text-slate-400 mb-3">Amplify your content across AI-friendly channels to maximize visibility with Perplexity, SearchGPT, and Claude.</p>
                  <ul className="text-sm text-slate-400 space-y-1 ml-4">
                    <li>• Automated social distribution to X and LinkedIn</li>
                    <li>• Technical citation optimization</li>
                    <li>• Internal link architecture for AI parsing</li>
                    <li>• Monitoring and real-time adjustments</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="bento-card">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Phase 3: Agentic Dominance (Weeks 9+)</h3>
                  <p className="text-slate-400 mb-3">Achieve sustained Agentic Dominance with ongoing optimization and competitive monitoring.</p>
                  <ul className="text-sm text-slate-400 space-y-1 ml-4">
                    <li>• Continuous trend monitoring via Scout Agent</li>
                    <li>• Monthly technical guide production</li>
                    <li>• Competitive gap analysis and response</li>
                    <li>• Performance tracking and ROI measurement</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="font-bold mb-4">Agentic Growth</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-6">$1,500<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Scout Agent for real-time trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>10 technical guides/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Automated social distribution</span>
                </li>
              </ul>
              <Button className="btn-neon w-full">Start Free Trial</Button>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/50 p-6">
              <h3 className="font-bold mb-4">Full-Stack Agentic Automation</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-6">$3,500<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Custom Sales Concierge</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Backend Agentic Pods</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Private RAG "Internal Brain"</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span>Weekly strategy calls</span>
                </li>
              </ul>
              <Button className="btn-neon w-full">Book Consultation</Button>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-slate-700 p-8">
            <h3 className="font-bold text-lg mb-4">Next Steps</h3>
            <p className="text-slate-300 mb-6">
              Your detailed audit report has been sent to your email. Our team will review your competitive gap and reach out within 24 hours to discuss your personalized strategy.
            </p>
            <p className="text-slate-400 text-sm">
              Questions? Contact us at <strong>aeoaudits@aheadoftrends.io</strong>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
