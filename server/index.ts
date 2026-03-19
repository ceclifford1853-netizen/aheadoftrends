import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import { appRouter } from "./routers";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeWebsite, calculateAeoScore, generateRecommendations, getStatusLabel } from "./services/aeoScoring";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// tRPC Middleware
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({
      userId: null,
      user: null,
      db: undefined,
    }),
  })
);

// REST AEO Diagnostic Endpoint (used by Home.tsx)
app.post("/api/aeo", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    const analysis = await analyzeWebsite(url);
    const scores = calculateAeoScore(analysis);
    const recommendations = generateRecommendations(analysis, scores);
    res.json({
      scores: {
        contentQuality: scores.contentQuality,
        technicalSeo: scores.technicalSeo,
        authority: scores.authority,
        chatVisibility: scores.chatVisibility,
        overall: scores.overall,
      },
      recommendations,
      statusLabel: getStatusLabel(scores.overall),
      analysis: { title: analysis.title, url: analysis.url },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Analysis failed";
    res.status(500).json({ error: msg });
  }
});

// Ko-fi Webhook Endpoint
app.post("/api/webhooks/kofi", express.urlencoded({ extended: true }), (req, res) => {
  try {
    const data = JSON.parse(req.body.data || "{}");
    console.log("[Ko-fi Webhook] Payment received:", {
      from: data.from_name,
      email: data.email,
      amount: data.amount,
      type: data.type,
      timestamp: new Date().toISOString(),
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[Ko-fi Webhook] Error:", err);
    res.status(200).json({ success: true });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
