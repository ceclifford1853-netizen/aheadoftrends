import PricingSection from "@/components/Pricing";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      <PricingSection />
      <Footer />
    </div>
  );
}
