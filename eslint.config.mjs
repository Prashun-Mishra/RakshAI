import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const baseDirectory = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

const config = [
  { ignores: [".next/**", "node_modules/**", "tsconfig.tsbuildinfo"] },
  ...compat.extends("next/core-web-vitals"),
];

export default config;
