import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="container flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-4">
          <Link href="/blog">
            <span className="text-sm hover:text-cyan-400 transition-colors cursor-pointer text-gray-300">
              Blog
            </span>
          </Link>
          <Link href="/guides">
            <span className="text-sm hover:text-cyan-400 transition-colors cursor-pointer text-gray-300">
              Guides
            </span>
          </Link>
          <Link href="/about-us">
            <span className="text-sm hover:text-cyan-400 transition-colors cursor-pointer text-gray-300">
              About
            </span>
          </Link>
        </div>
        <Link href="/alpha-rating">
          <Button className="btn-neon text-xs md:text-sm">
            Get AEO Rating
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
