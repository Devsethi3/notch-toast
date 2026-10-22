import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["packages/**/*.test.{ts,tsx}"],
    maxWorkers: 1,
    setupFiles: ["./tests/setup.ts"],
  },
})
