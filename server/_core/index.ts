import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import axios from "axios";
import * as cheerio from "cheerio";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // REST endpoint for homepage AEO tool (no auth required)
  app.post("/api/aeo", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "url is required" });
      }
      let target = url.trim();
      if (!target.startsWith("http")) target = "https://" + target;

      // Fetch the page HTML
      const response = await axios.get(target, {
        timeout: 15000,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AEOBot/1.0)" },
        maxRedirects: 5,
      });
      const html = response.data as string;
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $("title").text().trim() || "Untitled";
      const metaDesc = $("meta[name='description']").attr("content") || "";
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      const wordCount = bodyText.split(/\s+/).length;
      const headings = $("h1, h2, h3").length;
      const images = $("img").length;
      const imagesWithAlt = $("img[alt]").filter((_: number, el: any) => ($(el).attr("alt") || "").length > 0).length;
      const hasSchema = html.includes("application/ld+json");
      const hasOG = $("meta[property='og:title']").length > 0;
      const hasCanonical = $("link[rel='canonical']").length > 0;
      const hasHttps = target.startsWith("https");
      const internalLinks = $("a[href^='/']").length + $("a[href^='" + target + "']").length;
      const externalLinks = $("a[href^='http']").not("a[href^='" + target + "']").length;

      // Content Quality (40%)
      let cq = 3;
      if (wordCount > 300) cq += 1;
      if (wordCount > 800) cq += 1;
      if (wordCount > 1500) cq += 1;
      if (headings >= 3) cq += 1;
      if (headings >= 6) cq += 0.5;
      if (metaDesc.length > 50) cq += 1;
      if (imagesWithAlt > 0 && images > 0) cq += (imagesWithAlt / images) * 1.5;
      const contentQuality = Math.min(10, Math.round(cq * 10) / 10);

      // Technical SEO (25%)
      let ts = 3;
      if (hasHttps) ts += 2;
      if (hasCanonical) ts += 1.5;
      if (hasOG) ts += 1;
      if (title.length > 10 && title.length < 70) ts += 1;
      if (metaDesc.length > 50 && metaDesc.length < 160) ts += 1;
      if (response.status === 200) ts += 0.5;
      const technicalSeo = Math.min(10, Math.round(ts * 10) / 10);

      // Authority (20%)
      let au = 2;
      if (hasSchema) au += 2.5;
      if (externalLinks > 3) au += 1;
      if (internalLinks > 5) au += 1;
      if (wordCount > 1000) au += 1;
      if (headings >= 5) au += 0.5;
      if (hasOG) au += 1;
      au += Math.min(1, externalLinks * 0.1);
      const authority = Math.min(10, Math.round(au * 10) / 10);

      // Chat Visibility (15%)
      let cv = 2;
      if (hasSchema) cv += 2;
      if (metaDesc.length > 80) cv += 1;
      if (headings >= 3) cv += 1;
      if (wordCount > 500) cv += 1;
      if (hasOG) cv += 0.5;
      if (title.length > 0) cv += 0.5;
      if (imagesWithAlt > 2) cv += 0.5;
      cv += Math.min(1.5, (internalLinks + externalLinks) * 0.05);
      const chatVisibility = Math.min(10, Math.round(cv * 10) / 10);

      const overall = Math.round((contentQuality * 0.4 + technicalSeo * 0.25 + authority * 0.2 + chatVisibility * 0.15) * 10) / 10;

      const statusLabel = overall >= 8 ? "Dominant Presence" : overall >= 6 ? "Strong Presence" : overall >= 4 ? "Moderate Presence" : "Weak Presence";

      // Recommendations
      const recommendations: string[] = [];
      if (!hasSchema) recommendations.push("Add JSON-LD structured data (schema.org) to help AI understand your content.");
      if (wordCount < 800) recommendations.push("Increase content depth — aim for 1000+ words with clear headings and subheadings.");
      if (imagesWithAlt < images * 0.5) recommendations.push("Add descriptive alt text to all images for better AI comprehension.");
      if (!hasCanonical) recommendations.push("Add a canonical URL tag to prevent duplicate content issues.");
      if (metaDesc.length < 50) recommendations.push("Write a compelling meta description (120-155 chars) that summarizes your value proposition.");
      if (headings < 3) recommendations.push("Use more heading tags (H1-H3) to create clear content hierarchy.");
      if (!hasOG) recommendations.push("Add Open Graph meta tags for better social and AI preview rendering.");
      if (!hasHttps) recommendations.push("Migrate to HTTPS for security and trust signals.");

      return res.json({
        scores: { contentQuality, technicalSeo, authority, chatVisibility, overall },
        recommendations,
        statusLabel,
        analysis: { title, url: target },
      });
    } catch (err: any) {
      const msg = err.code === "ECONNREFUSED" ? "Could not connect to website" : err.message;
      return res.status(500).json({ error: msg });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
