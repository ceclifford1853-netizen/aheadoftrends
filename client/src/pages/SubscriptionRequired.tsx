import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function SubscriptionRequired() {
  const handleReset = () => {
    // Admin recovery: clears beta timer and reloads
    localStorage.removeItem('aot_beta_start_date');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-cyan-400/30 flex items-center justify-center"
            style={{ boxShadow: '0 0 40px rgba(34,211,238,0.15)' }}>
            <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Beta Access Expired
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your 14-day complimentary beta period has ended.
            Upgrade to continue accessing the AEO Alpha-Rating engine
            and all Technical Guides.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* CTA */}
        <div className="space-y-3">
          <Button
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold"
            onClick={() => window.location.href = 'mailto:hello@aheadoftrends.io?subject=Subscription%20Upgrade'}
          >
            Upgrade My Access
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:border-cyan-400/50">
              Back to Homepage
            </Button>
          </Link>
        </div>

        {/* Admin reset — hidden but accessible */}
        <button
          onClick={handleReset}
          className="text-xs text-slate-800 hover:text-slate-600 transition-colors mt-4"
        >
          ·
        </button>
      </div>
    </div>
  );
}
