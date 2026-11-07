import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@seed": fileURLToPath(new URL("./content-seed", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: { include: ["src/**/*.test.ts", "scripts/**/*.test.ts"] },
});
