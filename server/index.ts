import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import { appRouter } from "./routers";
import path from "path";
import { fileURLToPath } from "url";

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
