import { useEffect } from "react";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { injectWebApplicationSchema, injectOrganizationSchema } from "@/lib/schema";

export default function Home() {
  useEffect(() => {
    // Inject JSON-LD schemas for AEO authority signaling
    injectWebApplicationSchema({
      title: "Ahead of Trends - AEO Optimization Platform",
      description: "Advanced Answer Engine Optimization tool with 4-factor scoring algorithm for agencies and enterprises.",
      url: window.location.origin,
    });
    
    injectOrganizationSchema({
      title: "Ahead of Trends",
      description: "Leading AEO optimization platform for agencies.",
      url: window.location.origin,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Hero />
      <div className="section-divider" />
      <Pricing />
      <Footer />
    </div>
  );
}
