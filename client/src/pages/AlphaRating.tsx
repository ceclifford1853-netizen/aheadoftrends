import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AlphaRating() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    websiteUrl: "",
    companyName: "",
    industry: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const submitWebsite = trpc.aeo.submitWebsite.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitWebsite.mutateAsync({
        email: formData.email,
        websiteUrl: formData.websiteUrl,
        companyName: formData.companyName,
        industry: formData.industry,
      });

      setResult(response);
      toast.success("Website analyzed successfully!");
      setFormData({ email: "", websiteUrl: "", companyName: "", industry: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze website");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">Get Your</span>
                <br />
                <span className="glow-cyan text-cyan-400">AEO Rating</span>
              </h1>
              <p className="text-lg text-slate-300">
                Analyze your website's Answer Engine Optimization potential with our advanced 4-factor scoring engine.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form Section */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Submit Your Website
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-slate-300 mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="websiteUrl" className="text-slate-300 mb-2 block">
                      Website URL *
                    </Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-slate-300 mb-2 block">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Your Agency Name"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-slate-300 mb-2 block">
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      name="industry"
                      placeholder="e.g., SaaS, E-commerce, Agency"
                      value={formData.industry}
                      onChange={handleChange}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || submitWebsite.isPending}
                    className="btn-neon-cyan w-full"
                  >
                    {isSubmitting || submitWebsite.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Get AEO Rating"
                    )}
                  </Button>

                  <p className="text-xs text-slate-400 text-center">
                    Your analysis will be processed immediately. Results are valid for 14 days.
                  </p>
                </form>
              </div>

              {/* Results Section */}
              <div>
                {result ? (
                  <div className="bg-slate-900/50 border border-cyan-400/50 rounded-lg p-8 glow-cyan">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-2xl font-bold text-cyan-400">
                        Analysis Complete
                      </h3>
                    </div>

                    {/* Overall Score */}
                    <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm mb-2">Overall AEO Score</p>
                      <div className="text-5xl font-bold glow-cyan text-cyan-400">
                        {result.score}/10
                      </div>
                    </div>

                    {/* Factor Breakdown */}
                    <div className="space-y-4 mb-8">
                      <h4 className="font-semibold text-white mb-4">
                        4-Factor Breakdown
                      </h4>

                      <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">Content Quality (40%)</span>
                          <span className="text-cyan-400 font-bold">
                            {result.factors.quality}/10
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-cyan-400 h-2 rounded-full"
                            style={{
                              width: `${(result.factors.quality / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">Technical SEO (25%)</span>
                          <span className="text-pink-500 font-bold">
                            {result.factors.seo}/10
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full"
                            style={{
                              width: `${(result.factors.seo / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">Authority (20%)</span>
                          <span className="text-cyan-400 font-bold">
                            {result.factors.authority}/10
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-cyan-400 h-2 rounded-full"
                            style={{
                              width: `${(result.factors.authority / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300">AI Visibility (15%)</span>
                          <span className="text-pink-500 font-bold">
                            {result.factors.visibility}/10
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full"
                            style={{
                              width: `${(result.factors.visibility / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setResult(null)}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300"
                    >
                      Analyze Another Website
                    </Button>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertCircle className="w-6 h-6 text-slate-500" />
                      <h3 className="text-xl font-semibold text-slate-300">
                        What You'll Get
                      </h3>
                    </div>

                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span className="text-slate-300">
                          <strong>Content Quality Score</strong> - EEAT signals and depth analysis
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span className="text-slate-300">
                          <strong>Technical SEO Score</strong> - Core Web Vitals and performance
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span className="text-slate-300">
                          <strong>Authority Score</strong> - Backlinks and domain trust
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span className="text-slate-300">
                          <strong>AI Visibility Score</strong> - ChatGPT & Perplexity indexing
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-pink-500 font-bold">✓</span>
                        <span className="text-slate-300">
                          <strong>Personalized Recommendations</strong> - LLM-generated insights
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
