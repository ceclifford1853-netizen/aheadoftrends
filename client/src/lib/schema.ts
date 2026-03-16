/**
 * Injects WebApplication Schema for AEO Diagnostic Engine
 */
export const injectWebApplicationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AheadOfTrends Ai",
    "description": "The industry-standard AEO diagnostic tool providing zero-hallucination DOM analysis for AI visibility.",
    "url": "https://aheadoftrends.io",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Injects Organization Schema for Brand Authority
 */
export const injectOrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AheadOfTrends Ai",
    "url": "https://aheadoftrends.io",
    "logo": "https://d2xsxph8kpxj0f.cloudfront.net/310519663404809022/CziTcEtnqUteT2h42DU7Lt/aot_logo_ai_b8ee8557.jpg",
    "sameAs": [
      "https://ko-fi.com/aheadoftrends",
      "https://linkedin.com/company/aheadoftrends"
    ]
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};
