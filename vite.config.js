import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const brandAssets =
  "C:/Users/Gabriel Natan/.cursor/projects/c-Users-Gabriel-Natan-Desktop-gustavo-LOJA-de-Joias/assets";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@brand": brandAssets,
    },
  },
  server: {
    fs: {
      allow: [process.cwd(), brandAssets],
    },
  },
});
