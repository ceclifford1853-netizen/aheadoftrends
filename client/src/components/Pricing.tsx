import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, ArrowRight } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    description: "Perfect for agencies just starting with AEO",
    price: "$0",
    period: "14-day free trial",
    features: [
      "1 AEO audit per day",
      "4-factor scoring analysis",
      "Basic recommendations",
      "Email support",
      "14-day access window",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing agencies scaling their AEO practice",
    price: "$1,500",
    period: "per month",
    features: [
      "Unlimited AEO audits",
      "Advanced 4-factor analysis",
      "AI-powered recommendations",
      "Competitive gap analysis",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For agencies requiring full-stack automation",
    price: "$3,500",
    period: "per month",
    features: [
      "Everything in Professional",
      "Full-stack automation",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "White-label solution",
      "Advanced analytics",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  const [, navigate] = useLocation();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Simple, Transparent</span>
            <br />
            <span className="glow-cyan text-cyan-400">Pricing</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Choose the plan that fits your agency's needs. All plans include our core AEO scoring engine.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-lg border transition-all duration-300 ${
                tier.highlighted
                  ? "border-cyan-400 bg-slate-900/80 shadow-lg shadow-cyan-400/20 md:scale-105"
                  : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
              }`}
            >
              {/* Highlight badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-slate-950 text-sm font-bold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Tier name and description */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-white mb-1">
                    {tier.price}
                  </div>
                  <p className="text-sm text-slate-400">
                    {tier.period}
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => navigate("/alpha-rating")}
                  className={`w-full mb-8 ${
                    tier.highlighted
                      ? "btn-neon-cyan"
                      : "btn-neon-pink"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Features list */}
                <div className="space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="mt-20 pt-12 border-t border-slate-800">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">
                What's included in the free trial?
              </h4>
              <p className="text-slate-300 text-sm">
                Full access to our 4-factor AEO scoring engine, one audit per day, and basic recommendations for 14 days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">
                Can I upgrade anytime?
              </h4>
              <p className="text-slate-300 text-sm">
                Yes, upgrade at any time during your trial or subscription. Billing adjusts automatically.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">
                Do you offer custom plans?
              </h4>
              <p className="text-slate-300 text-sm">
                Absolutely. Contact our sales team for custom pricing tailored to your agency's specific needs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-slate-300 text-sm">
                We accept all major credit cards, wire transfers, and custom payment arrangements for enterprise clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
