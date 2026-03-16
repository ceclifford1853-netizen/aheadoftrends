# Ahead of Trends - Project TODO

## Phase 1: Design & Infrastructure
- [ ] Cyber Noir design tokens (colors, typography, spacing, shadows)
- [ ] Global CSS variables and Tailwind configuration
- [ ] Responsive navigation component with escape routes
- [ ] Layout shell with header and footer

## Phase 2: Core Pages & Routing
- [ ] Hero section with glow effect and CTA button
- [ ] Pricing page with service tier cards
- [ ] Alpha Rating form page (/alpha-rating)
- [ ] AEO scoring dashboard
- [ ] Legal pages (Privacy, Terms, About)
- [ ] Audits/Next Steps page

## Phase 3: Database & Schema
- [ ] Leads table for form submissions
- [ ] Scores table for AEO rating history
- [ ] User beta access tracking
- [ ] Analytics tables (pageVisits, conversions, trafficSources, deviceAnalytics)

## Phase 4: AEO Scoring Engine
- [ ] 4-factor weighted algorithm (Quality 40%, SEO 25%, Authority 20%, Visibility 15%)
- [ ] Web scraping integration for metadata extraction
- [ ] tRPC procedures for score calculation
- [ ] Agentic Pods processing animation (Scout → Architect → Ghostwriter → Auditor)
- [ ] Score output with visual breakdown

## Phase 5: Hard Guard & Authentication
- [ ] 14-day expiry middleware with type safety
- [ ] Day 15 Safety Net redirect logic
- [ ] Lead capture gating for full Competitive Gap Map
- [ ] Session management

## Phase 6: JSON-LD Schema & Authority Signaling
- [ ] WebApplication schema injection
- [ ] Organization schema
- [ ] Article/BlogPosting schema for blog pages
- [ ] FAQPage schema for help sections

## Phase 7: Lead Capture & Notifications
- [ ] Email validation on form submission
- [ ] Database persistence for leads
- [ ] Owner notification system (email + in-app)
- [ ] Lead magnet unlock (Competitive Gap Map)

## Phase 8: LLM Integration
- [ ] Personalized optimization recommendations based on score
- [ ] Analysis of Quality, SEO, Authority, Visibility factors
- [ ] Structured response generation
- [ ] Display recommendations on results page

## Phase 9: Analytics & Monitoring
- [ ] Real-time visitor tracking
- [ ] Conversion rate monitoring
- [ ] Protected analytics dashboard
- [ ] Lead source attribution

## Phase 10: Responsive Design & QA
- [ ] Mobile-first testing across all pages
- [ ] Button tappability verification
- [ ] Navigation responsiveness
- [ ] Form validation on mobile
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

## Phase 11: Deployment & Launch
- [ ] GitHub repository sync
- [ ] Vercel auto-deploy configuration
- [ ] Environment variables configured
- [ ] SSL/HTTPS active
- [ ] Domain setup (aheadoftrends.io)

## Phase 12: Post-Launch Monitoring
- [ ] Launch day KPI tracking
- [ ] Email automation setup (Day 0, 1, 3, 7, 10, 13)
- [ ] Paid acquisition channels (Google Ads, Perplexity optimization)
- [ ] Lead nurturing sequences

## Phase 13: Theme 1 (Planetary Horizon) Homepage Overhaul
- [x] Replace GlobeScene with PlanetaryHorizon Three.js scene on homepage
- [x] Add signal/device/lightning visualizations that spark and slow down
- [x] Animate logo on initial page load
- [x] Add AEO explainer section — what is AEO, why your business is invisible without it
- [x] Add Google-is-dead vs LLM search comparison section with visuals
- [x] Keep AEO tool as primary focus above the fold
- [x] Verify all existing functionality still works
- [x] Real DOM-based AEO scoring (cheerio) replacing mock random scores
- [x] Vitest tests for scoring algorithm (7/7 passing)
