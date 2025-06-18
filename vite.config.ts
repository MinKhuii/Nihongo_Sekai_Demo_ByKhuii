import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: "public",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
}));
