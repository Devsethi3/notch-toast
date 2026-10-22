import { create } from "zustand"
import { persist } from "zustand/middleware"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

interface PackageManagerState {
  packageManager: PackageManager
  setPackageManager: (packageManager: PackageManager) => void
}

const usePackageManager = create<PackageManagerState>()(
  persist(
    (set) => ({
      packageManager: "pnpm",
      setPackageManager: (packageManager: PackageManager) =>
        set(() => ({ packageManager })),
    }),
    {
      name: "package-manager-store",
    }
  )
)

export { type PackageManager, usePackageManager }
