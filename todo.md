# Ahead of Trends - Project TODO

- [x] Cyber Noir design system (dark bg, neon cyan/pink accents)
- [x] Hero section with glow effect and CTA to /alpha-rating
- [x] Navigation with logo, Blog, Guides, About, Get AEO Rating
- [x] Alpha Rating page with URL input and 4-factor scoring display
- [x] Lead capture form with email validation on Alpha Rating page
- [x] Ko-fi payment bridge ("Request Full Audit" button)
- [x] Pricing tiers (Agentic Growth $1,500/mo, Full-Stack $3,500/mo)
- [x] WebApplication JSON-LD schema injection for AEO authority
- [x] Organization JSON-LD schema injection
- [x] ProfessionalService JSON-LD schema injection
- [x] BetaGuard 14-day trial enforcement (localStorage, no Clerk)
- [x] Guides listing page with 15 technical guides
- [x] Individual guide rendering with markdown (marked)
- [x] AEO scoring engine backend (4-factor: Quality 40%, SEO 25%, Authority 20%, Visibility 15%)
- [x] Blog page with posts
- [x] About Us page
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Subscription Required page
- [x] Responsive footer with navigation links
- [x] TypeScript compilation passes (0 errors)
- [x] Production build succeeds
- [x] Remove Clerk dependency (localStorage-only auth)
- [ ] Push to GitHub (ceclifford1853-netizen/aheadoftrends)
- [ ] Deploy to Vercel
- [ ] Verify live deployment at aheadoftrends.io
- [ ] Owner email notifications on lead submission

## AEO Backend Completion (Video Standard)
- [x] Real AEO backend - axios+cheerio web crawler (no mock data)
- [x] Deterministic scoring engine - zero AI hallucinations
- [x] JSON-LD schema detection and parsing
- [x] FAQ/HowTo schema detection for AI visibility scoring
- [x] Concise answer paragraph detection (40-60 words)
- [x] Question-based heading detection (What/How/Why)
- [x] Image alt text coverage analysis
- [x] Specific, factual recommendations per finding
- [x] Error handling for blocked/unreachable sites
- [x] Removed random fallback scores - only real crawl data shown
- [x] Recommendations section displayed in AlphaRating UI
- [x] Vite proxy to Express server for dev mode API access
- [x] Deployed to Vercel at aheadoftrends.vercel.app

## Phase 4: Tool-First Pivot
- [x] Upload logo to CDN
- [x] Rewrite Home.tsx as tool-first (AEO input above fold) with Three.js Jet Cockpit globe
- [x] Add rich AEO educational resources section (AdSense ready, 800+ words)
- [x] Push service tiers below the fold
- [x] Zero-signup policy enforced
- [x] REST /api/aeo endpoint added to server/index.ts
- [ ] Test 10 websites on live site
- [ ] PDF report for Gemini and Charles
