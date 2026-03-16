/**
 * JSON-LD Schema Injection for AEO Authority Signaling
 * Injects structured data to signal high authority to ChatGPT, Perplexity, and other AI systems
 */

export interface SchemaConfig {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

/**
 * Inject WebApplication schema for ChatGPT and Perplexity indexing
 */
export function injectWebApplicationSchema(config: SchemaConfig): void {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.title,
    "description": config.description,
    "url": config.url,
    "image": config.imageUrl || `${config.url}/og-image.png`,
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free AEO analysis trial",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "500",
    },
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Inject Organization schema for brand authority
 */
export function injectOrganizationSchema(config: SchemaConfig): void {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ahead of Trends",
    "description": config.description,
    "url": config.url,
    "logo": config.imageUrl || `${config.url}/logo.png`,
    "sameAs": [
      "https://twitter.com/aheadoftrends",
      "https://linkedin.com/company/aheadoftrends",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@aheadoftrends.io",
    },
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Inject FAQPage schema for featured snippets
 */
export function injectFAQSchema(faqs: Array<{ question: string; answer: string }>): void {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Inject Article schema for blog posts
 */
export function injectArticleSchema(config: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
}): void {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": config.title,
    "description": config.description,
    "image": config.imageUrl,
    "author": {
      "@type": "Person",
      "name": config.author,
    },
    "datePublished": config.publishedDate,
    "dateModified": config.modifiedDate || config.publishedDate,
    "url": config.url,
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
