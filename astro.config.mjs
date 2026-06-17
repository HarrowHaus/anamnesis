// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// ANAMNESIS — static, content-first build (docs/02 §1).
// Islands hydrate later for search / facets / entry-drawer / scrollytelling.

/**
 * Inject the internal component gallery at /_preview. A file named
 * src/pages/_preview.astro would be excluded by Astro's underscore convention,
 * so we map the URL explicitly to a page that lives outside src/pages.
 */
const previewRoute = {
  name: "anamnesis-preview-route",
  hooks: {
    "astro:config:setup": (/** @type {{ injectRoute: Function }} */ { injectRoute }) => {
      injectRoute({ pattern: "/_preview", entrypoint: "./src/preview/index.astro" });
    },
  },
};

export default defineConfig({
  output: "static",
  integrations: [mdx(), previewRoute],
});
