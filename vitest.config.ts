import { defineConfig } from "vitest/config";
import { execSync } from "child_process";
import { join } from "path";

// Get the path to the jsdom-global package
const jsdomGlobalPath = execSync("npm ls jsdom-global")
  .toString()
  .trim()
  .split("\n")
  .filter((line) => line.includes("node_modules/jsdom-global"))
  .pop()
  ?.replace(/\s+/, "");

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: jsdomGlobalPath ? [join(jsdomGlobalPath, "register.js")] : [],
  },
});
