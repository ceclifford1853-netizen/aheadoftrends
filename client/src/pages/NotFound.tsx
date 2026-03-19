import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse" />
            <AlertCircle className="relative h-16 w-16 text-cyan-500" />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-4 text-cyan-400">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button className="btn-neon">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
