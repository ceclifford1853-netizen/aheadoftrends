import { useMemo } from 'react';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { blogPosts } from '../data/blogdata';
import KofiWidget from '@/components/KofiWidget';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug || '';
  const post = blogPosts.find((p) => p.slug === slug);

  const htmlContent = useMemo(() => {
    if (!post) return '';
    return marked.parse(post.content) as string;
  }, [post]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
          <div className="container flex items-center justify-between py-4">
            <Link href="/blog">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-semibold">Back to Blog</span>
              </div>
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-semibold text-cyan-400 mb-6">
            General
          </div>
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-slate-400 mb-8">This blog post could not be found.</p>
          <Link href="/blog">
            <Button className="bg-[#22d3ee] text-black font-bold">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
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

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            {post.category}
          </span>
          <h1 className="text-4xl font-extrabold text-white md:text-5xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 mt-4 text-slate-400 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* AI Summary / TL;DR */}
        {post.tldr && (
          <div className="p-6 mb-10 bg-indigo-950/60 border-l-8 border-indigo-500 rounded-r-lg shadow-sm">
            <h3 className="flex items-center gap-2 mb-2 font-bold text-indigo-300">
              <span>✨</span> AI Summary (TL;DR)
            </h3>
            <p className="italic text-slate-300 leading-relaxed">{post.tldr}</p>
          </div>
        )}

        {/* Article Body — parsed markdown */}
        <div
          className="prose prose-lg prose-invert prose-cyan max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Ko-fi Widget */}
        <div className="mt-12 p-8 border-t border-slate-700 text-center bg-slate-900/50 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-white">Enjoyed this AEO Insight?</h3>
          <p className="text-slate-400 mb-6">
            Support our research into the future of AI search or book a custom audit.
          </p>
          <KofiWidget type="button" />
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/50 rounded-lg p-8 text-center">
          <h3 className="font-bold text-xl mb-3 text-white">Ready to Dominate AI Chat Engines?</h3>
          <p className="text-slate-300 mb-6">Get your free AEO Alpha-Rating and discover where you're being ignored by AI systems compared to competitors.</p>
          <Link href="/alpha-rating">
            <Button className="bg-[#22d3ee] text-black font-bold hover:bg-[#22d3ee]/90 px-8 py-3">
              Get Your Free Rating
            </Button>
          </Link>
        </div>

        {/* AdSense */}
        <div className="mt-12 p-4 border-2 border-dashed border-slate-700 text-center text-slate-500 rounded-lg">
          [AdSense Slot: Article Bottom]
        </div>
      </article>
    </div>
  );
}
