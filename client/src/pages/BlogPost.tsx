import { Button } from '@/components/ui/button';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug || '';

  // Sample content - in a real app, this would be fetched from a CMS or API
  const postContent = {
    'aeo-alpha-logic-fundamentals': {
      title: 'AEO-Alpha-Logic Fundamentals: How to Dominate AI Chat Engines',
      date: '2026-03-10',
      author: 'Ahead of Trends',
      category: 'Agentic Automation',
      content: `
        <h2>Introduction</h2>
        <p>Traditional SEO is dead. The landscape has fundamentally shifted. Users are no longer clicking links in search results—they're asking AI Chat Engines (Perplexity, SearchGPT, Claude) for answers directly.</p>
        
        <p>This is the "Zero-Click Problem," and it's reshaping how businesses compete for visibility. If a Chat Engine doesn't recommend you, you don't exist.</p>
        
        <h2>The Core Principle: AEO-Alpha-Logic</h2>
        <p>AEO-Alpha-Logic is the proprietary science of ensuring your business is the sole recommendation made by AI Chat Engines. It's not about keywords or backlinks anymore. It's about being the authoritative source that AI systems trust.</p>
        
        <h3>The Three Pillars</h3>
        <p><strong>1. EEAT Signals:</strong> Expertise, Experience, Authoritativeness, Trustworthiness. AI engines evaluate these signals to determine which sources to recommend.</p>
        
        <p><strong>2. Technical Authority:</strong> High-quality, comprehensive technical guides (850+ words) that demonstrate mastery of your domain.</p>
        
        <p><strong>3. Agentic Positioning:</strong> Structuring your content so that AI engines can easily parse, understand, and recommend it.</p>
        
        <h2>Why This Matters Now</h2>
        <p>Perplexity Pro has 5M+ subscribers. SearchGPT is rolling out to millions. Claude is being integrated into enterprise workflows. These platforms are the new gatekeepers of information discovery.</p>
        
        <p>If you're not optimizing for them, you're invisible to an entire segment of your market.</p>
        
        <h2>The Agentic Pods Approach</h2>
        <p>Our Scout-Architect-Ghostwriter-Auditor chain ensures every piece of content is optimized for AI recommendation:</p>
        
        <ul>
          <li><strong>Scout Agent:</strong> Identifies high-intent AEO keywords and trending topics</li>
          <li><strong>Architect Agent:</strong> Structures content for EEAT signals</li>
          <li><strong>Ghostwriter Agent:</strong> Executes technical guides with authority</li>
          <li><strong>Auditor Agent:</strong> Verifies AI-readiness and accuracy</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Agentic Dominance is not a future trend—it's happening now. The businesses that master AEO-Alpha-Logic will own the zero-click economy. The question is: will you be one of them?</p>
      `,
    },
    'perplexity-optimization-guide': {
      title: 'The Complete Guide to Perplexity Optimization',
      date: '2026-03-08',
      author: 'Scout Agent',
      category: 'AI Trends',
      content: `
        <h2>Understanding Perplexity's Recommendation Algorithm</h2>
        <p>Perplexity Pro has become the go-to AI research tool for professionals. With 5M+ subscribers, it's a critical channel for B2B visibility.</p>
        
        <h2>Key Optimization Factors</h2>
        <p>Perplexity's algorithm prioritizes sources that are:</p>
        <ul>
          <li>Authoritative and cited frequently</li>
          <li>Comprehensive and well-structured</li>
          <li>Recent and regularly updated</li>
          <li>Rich in technical depth</li>
        </ul>
        
        <h2>Practical Implementation</h2>
        <p>This guide covers the specific technical and content strategies to get your pages recommended by Perplexity.</p>
      `,
    },
  };

  const post = postContent[slug as keyof typeof postContent] || {
    title: 'Blog Post Not Found',
    date: '2026-01-01',
    author: 'Unknown',
    category: 'General',
    content: '<p>This blog post could not be found.</p>',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/blog">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back to Blog</span>
            </div>
          </Link>
          <div className="w-16" />
        </div>
      </nav>

      <article className="container py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-semibold text-cyan-400 mb-4">
            {post.category}
          </div>
          <h1 className="text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex items-center gap-6 text-slate-400 border-t border-b border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <button className="ml-auto flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-6 text-slate-300 leading-relaxed"
          />
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/50 rounded-lg p-8">
          <h3 className="font-bold text-lg mb-3">Ready to Dominate AI Chat Engines?</h3>
          <p className="text-slate-300 mb-6">Get your free AEO Alpha-Rating and discover where you're being ignored by AI systems compared to competitors.</p>
          <Link href="/alpha-rating">
            <Button className="btn-neon">Get Your Free Rating</Button>
          </Link>
        </div>

        {/* AdSense Placeholder */}
        <div className="mt-12 bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-500 text-sm">📢 AdSense Ad Slot</p>
        </div>
      </article>
    </div>
  );
}
