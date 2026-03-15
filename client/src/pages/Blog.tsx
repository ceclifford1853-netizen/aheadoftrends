import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const blogPosts = [
  {
    slug: 'aeo-alpha-logic-fundamentals',
    title: 'AEO-Alpha-Logic Fundamentals: How to Dominate AI Chat Engines',
    excerpt: 'Learn the core principles of Answer Engine Optimization and how to position your content for AI recommendations.',
    date: '2026-03-10',
    author: 'Ahead of Trends',
    category: 'Agentic Automation',
  },
  {
    slug: 'perplexity-optimization-guide',
    title: 'The Complete Guide to Perplexity Optimization',
    excerpt: 'Master the techniques to get your content recommended by Perplexity Pro users.',
    date: '2026-03-08',
    author: 'Scout Agent',
    category: 'AI Trends',
  },
  {
    slug: 'searchgpt-content-strategy',
    title: 'SearchGPT Content Strategy: 2026 Edition',
    excerpt: 'Comprehensive guide to optimizing for SearchGPT recommendations and capturing zero-click traffic.',
    date: '2026-03-05',
    author: 'Architect Agent',
    category: 'Content Strategy',
  },
  {
    slug: 'eeat-signals-ai-engines',
    title: 'EEAT Signals That Matter to AI Chat Engines',
    excerpt: 'Deep dive into Expertise, Experience, Authoritativeness, and Trustworthiness signals for AI recommendations.',
    date: '2026-03-01',
    author: 'Ghostwriter Agent',
    category: 'Technical SEO',
  },
  {
    slug: 'technical-content-authority',
    title: 'Building Technical Content Authority for AI Dominance',
    excerpt: 'How to create high-authority technical guides that AI engines can\'t ignore.',
    date: '2026-02-25',
    author: 'Auditor Agent',
    category: 'Content',
  },
  {
    slug: 'ai-trend-forecasting',
    title: 'AI Trend Forecasting: Staying Ahead of the Curve',
    excerpt: 'Techniques for identifying emerging AI trends before they go mainstream.',
    date: '2026-02-20',
    author: 'Scout Agent',
    category: 'Trends',
  },
  {
    slug: 'claude-integration-optimization',
    title: 'Claude Integration Optimization for Enterprise',
    excerpt: 'Advanced techniques for ensuring your content is recommended by Claude and Claude Pro users.',
    date: '2026-02-15',
    author: 'Architect Agent',
    category: 'AI Integration',
  },
  {
    slug: 'competitive-gap-analysis',
    title: 'Competitive Gap Analysis: Finding Your Agentic Advantage',
    excerpt: 'How to identify where competitors are being ignored by AI engines and capitalize on the gap.',
    date: '2026-02-10',
    author: 'Scout Agent',
    category: 'Competitive Analysis',
  },
  {
    slug: 'rag-content-strategy',
    title: 'RAG-Based Content Strategy: The Future of AEO',
    excerpt: 'Understanding Retrieval-Augmented Generation and optimizing for RAG-powered AI systems.',
    date: '2026-02-05',
    author: 'Ghostwriter Agent',
    category: 'Advanced AEO',
  },
  {
    slug: 'zero-click-traffic-monetization',
    title: 'Monetizing Zero-Click Traffic from AI Recommendations',
    excerpt: 'Strategies for converting AI engine recommendations into revenue and customer acquisition.',
    date: '2026-02-01',
    author: 'Auditor Agent',
    category: 'Monetization',
  },
  {
    slug: 'agentic-pods-workflow',
    title: 'The Agentic Pods Workflow: Scout to Auditor Chain',
    excerpt: 'Complete walkthrough of how our Scout, Architect, Ghostwriter, and Auditor agents work together.',
    date: '2026-01-28',
    author: 'Ahead of Trends',
    category: 'Agentic Automation',
  },
  {
    slug: 'future-of-search-2026',
    title: 'The Future of Search in 2026: AI Chat Engines Are Winning',
    excerpt: 'Analysis of how AI chat engines are reshaping search behavior and what it means for your strategy.',
    date: '2026-01-25',
    author: 'Scout Agent',
    category: 'Industry Analysis',
  },
];

export default function Blog() {
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
          <h1 className="text-lg font-bold">Blog</h1>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Agentic Automation Blog</h1>
          <p className="text-slate-400 text-lg">Technical guides, case studies, and insights on AEO-Alpha-Logic and Agentic Dominance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="bento-card h-full cursor-pointer flex flex-col">
                <div className="flex-1">
                  <div className="inline-block px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-semibold text-cyan-400 mb-3">
                    {post.category}
                  </div>
                  <h3 className="font-bold text-lg mb-3 leading-tight">{post.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
