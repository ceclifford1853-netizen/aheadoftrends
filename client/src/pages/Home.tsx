import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, TrendingUp, Share2, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { AgenticStatusTracker } from '@/components/AgenticStatusTracker';

import { ScarcityCounter } from '@/components/ScarcityCounter';

const trendData = [
  { name: 'Runway ML', growth: '+234%', status: 'LIVE', color: 'cyan' },
  { name: 'Cursor AI', growth: '+412%', status: 'LIVE', color: 'blue' },
  { name: 'Claude 4 Integration', growth: '+189%', status: 'LIVE', color: 'cyan' },
  { name: 'Perplexity Pro', growth: '+156%', status: 'LIVE', color: 'blue' },
  { name: 'SearchGPT Adoption', growth: '+298%', status: 'LIVE', color: 'cyan' },
];

const agentPods = [
  { name: 'Scout Agent', desc: 'Real-time trend monitoring', icon: '🛰️' },
  { name: 'Architect Agent', desc: 'Content structure & EEAT', icon: '🏗️' },
  { name: 'Ghostwriter Agent', desc: 'Technical guides (850+w)', icon: '✍️' },
  { name: 'Auditor Agent', desc: 'AI-readiness verification', icon: '🛡️' },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Inject JSON-LD schema for AEO authority signaling
  useEffect(() => {
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Ahead of Trends AEO Alpha-Rating",
        "url": "https://aheadoftrends.io",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "AI Engine Optimization diagnostic tool that scores websites on Content Quality, Technical SEO, Authority, and Chat Visibility for dominance in AI chat engines like ChatGPT and Perplexity.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free AEO Alpha-Rating visibility check"
        },
        "creator": {
          "@type": "Organization",
          "name": "Ahead of Trends",
          "url": "https://aheadoftrends.io"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Ahead of Trends",
        "url": "https://aheadoftrends.io",
        "logo": "https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot-logo_7211d01a.jpg",
        "description": "Agentic Engine Optimization agency specializing in AI Chat Engine visibility, AEO scoring, and automated content strategies.",
        "sameAs": [],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "aeoaudits@aheadoftrends.io",
          "contactType": "sales"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Ahead of Trends AEO Services",
        "url": "https://aheadoftrends.io",
        "description": "Professional Agentic Engine Optimization services including AI visibility audits, content strategy, and automated lead generation.",
        "priceRange": "$250-$3500",
        "serviceType": ["AI Engine Optimization", "AEO Auditing", "Content Strategy", "Technical SEO"]
      }
    ];

    const existingScripts = document.querySelectorAll('script[data-aeo-schema]');
    existingScripts.forEach(s => s.remove());

    schemas.forEach((schema, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-aeo-schema', `schema-${i}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.querySelectorAll('script[data-aeo-schema]');
      scripts.forEach(s => s.remove());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to aeoaudits@aheadoftrends.io
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setCompany('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">


      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-24 overflow-hidden scanlines"
        style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663423155062/KNAYrPKzRVnXnAXtfvivqD/hero-bg-aYYx8kV4Ab3gRR3yPS8eLf.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="container relative z-10">
          {/* Scarcity Counter */}
          <div className="mb-8 flex justify-start">
            <ScarcityCounter totalSlots={20} filledSlots={3} />
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5">
              <span className="pulse-live-dot" />
              <span className="text-xs font-semibold text-cyan-400">AGENTIC DOMINANCE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              If a Chat Engine doesn't recommend you,
              <span className="text-cyan-400"> you don't exist.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl">
              Traditional SEO is dead. <strong>Agentic Dominance</strong> is the only way forward. We ensure your business is the sole recommendation made by AI Chat Engines using <strong>AEO-Alpha-Logic</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/alpha-rating">
                <Button className="btn-neon w-full sm:w-auto">
                  Get My Free AEO Alpha-Rating <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button className="btn-neon-outline w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agentic Trend Radar */}
      <section className="py-16 md:py-24 border-t border-slate-800">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Agentic Trend Radar</h2>
            <p className="text-slate-400 max-w-2xl">Real-time AI trends that are reshaping search. These are the high-intent keywords your competitors are missing.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {trendData.map((trend, i) => (
              <div key={i} className="bento-card group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{trend.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="metric-value">{trend.growth}</span>
                      <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Growth</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="pulse-live text-xs font-bold text-cyan-400">
                      <span className="pulse-live-dot" />
                      {trend.status}
                    </span>
                  </div>
                </div>
                <button className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300">
                  <Share2 className="w-3 h-3" />
                  Share to X
                </button>
              </div>
            ))}
          </div>

          {/* AdSense Placeholder */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-slate-500 text-sm">📢 AdSense Ad Slot — High-visibility placement</p>
          </div>
        </div>
      </section>

      {/* Agentic Status Tracker */}
      <section className="py-16 md:py-24 border-t border-slate-800">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Agentic Workflow in Motion</h2>
            <p className="text-slate-400 max-w-2xl">Watch the agent chain execute in real-time. From Scout to Auditor, every step is optimized for AEO dominance.</p>
          </div>
          <AgenticStatusTracker isActive={true} />
        </div>
      </section>

      {/* Agentic Pods Fulfillment Engine */}
      <section className="py-16 md:py-24 border-t border-slate-800">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Agentic Pods Fulfillment Engine</h2>
            <p className="text-slate-400 max-w-2xl">Our specialized agent chain powers every service delivery. See exactly what's happening behind the scenes.</p>
          </div>

          <div 
            className="relative mb-12 rounded-lg overflow-hidden"
            style={{
              backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663423155062/KNAYrPKzRVnXnAXtfvivqD/agentic-pods-visual-HhMLKKyHeHNUZEqHkKAzpo.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '300px',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentPods.map((pod, i) => (
              <div key={i} className="bento-card">
                <div className="text-3xl mb-3">{pod.icon}</div>
                <h3 className="font-bold mb-2">{pod.name}</h3>
                <p className="text-sm text-slate-400">{pod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="py-16 md:py-24 border-t border-slate-800">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Service Tiers</h2>
            <p className="text-slate-400 max-w-2xl">Choose your level of Agentic Automation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tier 1 */}
            <Card className="bg-slate-900/50 border-slate-700 p-8">
              <h3 className="text-2xl font-bold mb-2">Agentic Growth</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-6">$1,500<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                  <span>Scout Agent for real-time trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                  <span>10 agent-written technical guides/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                  <span>Automated social distribution</span>
                </li>
              </ul>
              <Link href="/alpha-rating">
                <Button className="btn-neon w-full">Start Free Trial</Button>
              </Link>
            </Card>

            {/* Tier 2 */}
            <Card className="bg-slate-900/50 border-cyan-500/50 p-8 ring-1 ring-cyan-500/20">
              <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4">
                <span className="text-xs font-bold text-cyan-400">RECOMMENDED</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Full-Stack Agentic Automation</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-6">$3,500<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                  <span>Custom Agentic Sales Concierge on-site</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                  <span>Backend Agentic Pods for workflow plumbing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                  <span>Unlimited technical content generation</span>
                </li>
              </ul>
              <Link href="/alpha-rating">
                <Button className="btn-neon w-full">Start Free Trial</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 border-t border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Ahead of Trends</h2>
            <p className="text-slate-300 mb-8">Get weekly insights on AI trends, AEO strategies, and Agentic Automation tactics.</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="btn-neon">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
            {submitted && <p className="text-cyan-400 text-sm mt-2">✓ Thanks for subscribing!</p>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Ahead of Trends</h3>
              <p className="text-slate-400 text-sm">Agentic Engine Optimization for the future of search.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/alpha-rating"><span className="hover:text-cyan-400 cursor-pointer">AEO Rating</span></Link></li>
                <li><Link href="/blog"><span className="hover:text-cyan-400 cursor-pointer">Blog</span></Link></li>
                <li><Link href="/guides"><span className="hover:text-cyan-400 cursor-pointer">Guides</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about-us"><span className="hover:text-cyan-400 cursor-pointer">About Us</span></Link></li>
                <li><Link href="/privacy-policy"><span className="hover:text-cyan-400 cursor-pointer">Privacy</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/terms-of-service"><span className="hover:text-cyan-400 cursor-pointer">Terms</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2026 Ahead of Trends. All rights reserved. | Powered by Agentic Engine Optimization</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
