import { Link } from 'wouter';
import { ArrowLeft, BookOpen, Calendar, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const guides = [
  { slug: '01-aeo-vs-traditional-seo', title: 'AEO vs Traditional SEO: Why Chat Engines Changed Everything', category: 'Agentic Strategy', date: '2026-03-10', premium: true },
  { slug: '02-eeat-signals', title: 'EEAT Signals That Matter to AI Chat Engines', category: 'Technical SEO', date: '2026-03-09', premium: true },
  { slug: '03-content-structure', title: 'Content Structure for AI Readability', category: 'Content Strategy', date: '2026-03-08', premium: false },
  { slug: '04-schema-markup', title: 'Schema Markup for Agentic Dominance', category: 'Technical SEO', date: '2026-03-07', premium: false },
  { slug: '05-keyword-strategy', title: 'Keyword Strategy for AI Chat Engines', category: 'Content Strategy', date: '2026-03-06', premium: true },
  { slug: '06-ai-engine-optimization', title: 'AI Engine Optimization: The Complete Guide', category: 'Agentic Strategy', date: '2026-03-05', premium: true },
  { slug: '07-citation-strategy', title: 'Citation Strategy for Authority Building', category: 'Authority', date: '2026-03-04', premium: false },
  { slug: '08-content-audit', title: 'Content Audit for AEO Readiness', category: 'Content Strategy', date: '2026-03-03', premium: true },
  { slug: '09-competitor-analysis', title: 'Competitor Analysis in the AI Era', category: 'Competitive Intelligence', date: '2026-03-02', premium: false },
  { slug: '10-link-strategy', title: 'Link Strategy for AI Visibility', category: 'Authority', date: '2026-03-01', premium: true },
  { slug: '11-technical-seo', title: 'Technical SEO for AI Crawlers', category: 'Technical SEO', date: '2026-02-28', premium: false },
  { slug: '12-content-calendar', title: 'Content Calendar for Agentic Dominance', category: 'Content Strategy', date: '2026-02-27', premium: true },
  { slug: '13-user-signals', title: 'User Signals That AI Engines Track', category: 'Agentic Strategy', date: '2026-02-26', premium: false },
  { slug: '14-brand-authority', title: 'Brand Authority in the Age of AI', category: 'Authority', date: '2026-02-25', premium: true },
  { slug: '15-future-of-aeo', title: 'The Future of AEO: 2026 and Beyond', category: 'Industry Analysis', date: '2026-02-24', premium: false },
];

export default function Guides() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="container py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold">Technical Guides</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl">
            15 in-depth technical guides on AEO-Alpha-Logic, Agentic Dominance, and AI Chat Engine optimization. Master the science of being the sole recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              <Card className="bento-card h-full cursor-pointer flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-semibold text-cyan-400">
                      {guide.category}
                    </span>
                    {guide.premium && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs font-semibold text-amber-400">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-3 leading-tight">{guide.title}</h3>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-slate-700 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(guide.date).toLocaleDateString()}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/alpha-rating">
            <Button className="btn-neon text-lg px-8 py-4">
              Get Your Free AEO Alpha-Rating
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
