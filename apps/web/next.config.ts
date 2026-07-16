import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { NextConfig } from "next";

function loadSharedEnvOnce() {
  // Monorepo: .env vive en la raíz (apps/web → ../../.env).
  // También se prueba apps/.env por compatibilidad.
  const candidates = [
    join(__dirname, "../../.env"),
    join(__dirname, "../.env"),
  ];
  const envPath = candidates.find((path) => existsSync(path));
  if (!envPath) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadSharedEnvOnce();

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tanstack/react-query",
      "@tanstack/react-table",
      "recharts",
    ],
  },
};

export default nextConfig;
