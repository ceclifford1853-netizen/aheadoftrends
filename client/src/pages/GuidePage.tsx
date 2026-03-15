import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Calendar, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';

// Guide metadata mapping
const guideMeta: Record<string, { title: string; category: string; date: string; premium: boolean; file: string }> = {
  '01-aeo-vs-traditional-seo': { title: 'AEO vs Traditional SEO: Why Chat Engines Changed Everything', category: 'Agentic Strategy', date: '2026-03-10', premium: true, file: '01-aeo-vs-traditional-seo.md' },
  '02-eeat-signals': { title: 'EEAT Signals That Matter to AI Chat Engines', category: 'Technical SEO', date: '2026-03-09', premium: true, file: '02-eeat-signals.md' },
  '03-content-structure': { title: 'Content Structure for AI Readability', category: 'Content Strategy', date: '2026-03-08', premium: false, file: '03-content-structure.md' },
  '04-schema-markup': { title: 'Schema Markup for Agentic Dominance', category: 'Technical SEO', date: '2026-03-07', premium: false, file: '04-schema-markup.md' },
  '05-keyword-strategy': { title: 'Keyword Strategy for AI Chat Engines', category: 'Content Strategy', date: '2026-03-06', premium: true, file: '05-keyword-strategy.md' },
  '06-ai-engine-optimization': { title: 'AI Engine Optimization: The Complete Guide', category: 'Agentic Strategy', date: '2026-03-05', premium: true, file: '06-ai-engine-optimization.md' },
  '07-citation-strategy': { title: 'Citation Strategy for Authority Building', category: 'Authority', date: '2026-03-04', premium: false, file: '07-citation-strategy.md' },
  '08-content-audit': { title: 'Content Audit for AEO Readiness', category: 'Content Strategy', date: '2026-03-03', premium: true, file: '08-content-audit.md' },
  '09-competitor-analysis': { title: 'Competitor Analysis in the AI Era', category: 'Competitive Intelligence', date: '2026-03-02', premium: false, file: '09-competitor-analysis.md' },
  '10-link-strategy': { title: 'Link Strategy for AI Visibility', category: 'Authority', date: '2026-03-01', premium: true, file: '10-link-strategy.md' },
  '11-technical-seo': { title: 'Technical SEO for AI Crawlers', category: 'Technical SEO', date: '2026-02-28', premium: false, file: '11-technical-seo.md' },
  '12-content-calendar': { title: 'Content Calendar for Agentic Dominance', category: 'Content Strategy', date: '2026-02-27', premium: true, file: '12-content-calendar.md' },
  '13-user-signals': { title: 'User Signals That AI Engines Track', category: 'Agentic Strategy', date: '2026-02-26', premium: false, file: '13-user-signals.md' },
  '14-brand-authority': { title: 'Brand Authority in the Age of AI', category: 'Authority', date: '2026-02-25', premium: true, file: '14-brand-authority.md' },
  '15-future-of-aeo': { title: 'The Future of AEO: 2026 and Beyond', category: 'Industry Analysis', date: '2026-02-24', premium: false, file: '15-future-of-aeo.md' },
};

// Import all guide files using Vite's import.meta.glob
const guideFiles = import.meta.glob('/client/src/content/technical-guides/*.md', { query: '?raw', import: 'default' });

export default function GuidePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  const meta = guideMeta[slug];
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuide() {
      if (!meta) {
        setLoading(false);
        return;
      }

      try {
        // Try to load the markdown file
        const filePath = `/client/src/content/technical-guides/${meta.file}`;
        const loader = guideFiles[filePath];
        if (loader) {
          const raw = await loader() as string;
          // Remove frontmatter
          const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\s*/, '');
          const html = marked.parse(withoutFrontmatter) as string;
          setContent(html);
        } else {
          setContent('<p>Guide content is being prepared. Check back soon.</p>');
        }
      } catch {
        setContent('<p>Guide content is being prepared. Check back soon.</p>');
      }
      setLoading(false);
    }
    loadGuide();
  }, [slug, meta]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
          <Link href="/guides">
            <Button className="btn-neon">Back to Guides</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="container max-w-4xl py-12">
        {/* Back navigation */}
        <Link href="/guides">
          <Button variant="ghost" className="mb-6 text-slate-400 hover:text-cyan-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Guides
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-semibold text-cyan-400">
              {meta.category}
            </span>
            {meta.premium && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs font-semibold text-amber-400">
                <Lock className="w-3 h-3" /> Premium Content
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">{meta.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(meta.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Ahead of Trends Agentic Team
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
        ) : (
          <article
            className="prose prose-invert prose-cyan max-w-none
              prose-headings:text-slate-100 prose-p:text-slate-300
              prose-a:text-cyan-400 prose-strong:text-slate-100
              prose-blockquote:border-cyan-500/50 prose-blockquote:bg-slate-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded
              prose-code:text-cyan-300 prose-code:bg-slate-800/50 prose-code:px-1 prose-code:rounded
              prose-table:border-slate-700 prose-th:border-slate-700 prose-td:border-slate-700
              prose-th:bg-slate-800/50 prose-th:text-cyan-400"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* CTA */}
        <div className="mt-12 p-8 rounded-xl border border-cyan-500/20 bg-slate-900/50 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Dominate AI Chat Engines?</h3>
          <p className="text-slate-400 mb-6">Get your free AEO Alpha-Rating and discover your AI visibility score.</p>
          <Link href="/alpha-rating">
            <Button className="btn-neon text-lg px-8 py-4">
              Get Your Free Alpha-Rating
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
