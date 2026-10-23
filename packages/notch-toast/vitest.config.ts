import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    maxWorkers: 1,
    setupFiles: ["../../tests/setup.ts"],
  },
})
