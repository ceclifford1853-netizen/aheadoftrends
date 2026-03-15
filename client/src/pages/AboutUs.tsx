import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, Zap } from 'lucide-react';

export default function AboutUs() {
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
          <h1 className="text-lg font-bold">About Us</h1>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">About Ahead of Trends</h1>
          
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-slate-300">
              Ahead of Trends is a high-prestige <strong>Agentic Intelligence Agency</strong> solving the "Zero-Click Problem" where users ask AI Chat Engines (Perplexity, SearchGPT, Claude) for answers instead of clicking links.
            </p>

            <h2>Our Mission</h2>
            <p>
              We ensure our clients are the <strong>sole recommendation made by AI Chat Engines</strong> using our proprietary <strong>AEO-Alpha-Logic</strong> framework.
            </p>

            <h2>The Problem We Solve</h2>
            <p>
              Traditional SEO is dead. The landscape has fundamentally shifted. With 5M+ Perplexity Pro subscribers, millions of SearchGPT users, and Claude integrated into enterprise workflows, AI Chat Engines are the new gatekeepers of information discovery.
            </p>
            <p>
              If a Chat Engine doesn't recommend you, you don't exist.
            </p>

            <h2>Our Approach: The Agentic Pods</h2>
            <p>
              We fulfill every service delivery through a specialized chain of AI agents:
            </p>
            <ul>
              <li><strong>Scout Agent:</strong> Scans real-time data for high-intent AEO keywords and trending tools</li>
              <li><strong>Architect Agent:</strong> Structures content based on EEAT signals and technical requirements</li>
              <li><strong>Ghostwriter Agent:</strong> Executes high-authority technical guides (850+ words)</li>
              <li><strong>Auditor Agent:</strong> Final quality check for AI-readiness and accuracy</li>
            </ul>

            <h2>Why We're Different</h2>
            <p>
              We don't optimize for search engines. We optimize for AI Chat Engines. We don't create content for clicks. We create content for recommendations. We don't measure success by traffic. We measure success by Agentic Dominance.
            </p>

            <h2>Our Commitment</h2>
            <p>
              We are committed to helping businesses dominate the zero-click economy through strategic, data-driven, and technologically advanced Agentic Automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bento-card">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">Precision</h3>
              <p className="text-sm text-slate-400">Every strategy is data-driven and AI-optimized</p>
            </Card>
            <Card className="bento-card">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">Speed</h3>
              <p className="text-sm text-slate-400">Rapid deployment of technical guides and content</p>
            </Card>
            <Card className="bento-card">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold mb-2">Authority</h3>
              <p className="text-sm text-slate-400">Premium positioning as AI-trusted sources</p>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Dominate AI Chat Engines?</h2>
            <p className="text-slate-300 mb-6">
              Start with a free AEO Alpha-Rating to see where you're being ignored by AI systems compared to competitors.
            </p>
            <Link href="/alpha-rating">
              <Button className="btn-neon">
                Get Your Free Rating
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
