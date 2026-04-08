import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    app: "./src/index.ts",
    index: "./index.ts",
  },
  format: "esm",
  outDir: "./dist",
  clean: true,
  noExternal: [/@cashory-demo\/.*/],
});
