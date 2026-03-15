import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

// Navbar with integrated logo - Deployment: 2026-03-11T13:10:00Z
export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
            {/* Logo Image */}
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot-logo_7211d01a.jpg" 
              alt="Ahead of Trends Logo" 
              className="h-12 md:h-14 w-auto object-contain drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))',
                imageRendering: 'crisp-edges',
              }}
            />
            <span className="font-bold text-sm md:text-lg hidden sm:inline bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Ahead of Trends
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog">
            <span className="text-sm hover:text-cyan-400 transition-colors cursor-pointer">Blog</span>
          </Link>
          <Link href="/guides">
            <span className="text-sm hover:text-cyan-400 transition-colors cursor-pointer">Guides</span>
          </Link>
          <Link href="/about-us">
            <span className="text-sm hover:text-cyan-400 transition-colors cursor-pointer">About</span>
          </Link>
          <Link href="/alpha-rating">
            <Button className="btn-neon text-xs md:text-sm">Get AEO Rating</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
