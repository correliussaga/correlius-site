import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://correlius.org",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
