import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { spawn } from "node:child_process";

function expressDevServer() {
  let serverProcess: ReturnType<typeof spawn> | null = null;
  return {
    name: "express-dev-server",
    configureServer() {
      // Start Express server on port 5000 using tsx
      serverProcess = spawn("npx", ["tsx", "server/index.ts"], {
        cwd: path.resolve(import.meta.dirname),
        stdio: "inherit",
        env: { ...process.env, PORT: "5000" },
      });
      serverProcess.on("error", (err) => {
        console.error("[Express] Failed to start:", err.message);
      });
    },
    closeBundle() {
      serverProcess?.kill();
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), expressDevServer()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
