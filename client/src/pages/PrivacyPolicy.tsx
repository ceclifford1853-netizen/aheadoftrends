import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back</span>
            </div>
          </Link>
          <h1 className="text-lg font-bold">Privacy Policy</h1>
          <div className="w-16" />
        </div>
      </nav>

      <article className="container py-12 max-w-3xl prose prose-invert">
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> March 10, 2026</p>

        <h2>1. Introduction</h2>
        <p>Ahead of Trends ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website aheadoftrends.io and use our services.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect information you voluntarily provide when you:</p>
        <ul>
          <li>Sign up for our beta program or services</li>
          <li>Use our AEO Alpha-Rating calculator</li>
          <li>Subscribe to our blog or newsletter</li>
          <li>Contact us for inquiries</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Send you service-related announcements</li>
          <li>Respond to your inquiries and support requests</li>
          <li>Analyze usage patterns and improve user experience</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

        <h2>5. Third-Party Services</h2>
        <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at aeoaudits@aheadoftrends.io.</p>

        <h2>7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

        <h2>8. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at aeoaudits@aheadoftrends.io.</p>
      </article>
    </div>
  );
}
