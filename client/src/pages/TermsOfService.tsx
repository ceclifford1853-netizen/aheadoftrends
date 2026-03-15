import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
          <h1 className="text-lg font-bold">Terms of Service</h1>
          <div className="w-16" />
        </div>
      </nav>

      <article className="container py-12 max-w-3xl prose prose-invert">
        <h1>Terms of Service</h1>
        <p><strong>Last Updated:</strong> March 10, 2026</p>

        <h2>1. Agreement to Terms</h2>
        <p>By accessing and using the Ahead of Trends website and services, you accept and agree to be bound by and comply with these Terms of Service.</p>

        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Ahead of Trends' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software contained on the website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>

        <h2>3. Disclaimer</h2>
        <p>The materials on Ahead of Trends' website are provided on an 'as is' basis. Ahead of Trends makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

        <h2>4. Limitations</h2>
        <p>In no event shall Ahead of Trends or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ahead of Trends' website.</p>

        <h2>5. Accuracy of Materials</h2>
        <p>The materials appearing on Ahead of Trends' website could include technical, typographical, or photographic errors. Ahead of Trends does not warrant that any of the materials on its website are accurate, complete, or current.</p>

        <h2>6. Links</h2>
        <p>Ahead of Trends has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Ahead of Trends of the site. Use of any such linked website is at the user's own risk.</p>

        <h2>7. Modifications</h2>
        <p>Ahead of Trends may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>

        <h2>8. Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>

        <h2>9. Contact Information</h2>
        <p>If you have any questions about these Terms of Service, please contact us at aeoaudits@aheadoftrends.io.</p>
      </article>
    </div>
  );
}
