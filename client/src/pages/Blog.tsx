import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { blogPosts } from '../data/blogdata';

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#000508] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#000508]/80 backdrop-blur-md border-b border-white/5">
        <Link href="/">
          <span className="font-bold text-lg tracking-tight cursor-pointer">Ahead of Trends</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <Link href="/blog"><span className="text-white cursor-pointer">Blog</span></Link>
          <Link href="/guides"><span className="hover:text-white transition-colors cursor-pointer">Guides</span></Link>
          <Link href="/about-us"><span className="hover:text-white transition-colors cursor-pointer">About</span></Link>
          <Link href="/alpha-rating">
            <Button size="sm" className="bg-[#22d3ee] text-black font-bold hover:bg-[#22d3ee]/90">Get AEO Rating</Button>
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <Link href="/">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">AEO Intelligence Blog</h1>
          <p className="text-slate-400 text-lg">Authoritative guides on Answer Engine Optimization, entity integrity, and Agentic Dominance.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="bg-white/5 border border-white/10 hover:border-[#22d3ee]/40 transition-all hover:bg-white/8 cursor-pointer h-full p-6 flex flex-col">
                <div className="mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#22d3ee] bg-[#22d3ee]/10 px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-3 leading-tight flex-1">{post.title}</h2>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
