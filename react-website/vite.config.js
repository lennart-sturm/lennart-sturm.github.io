import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/lennart-sturm.github.io/", // important for GitHub Pages
});
