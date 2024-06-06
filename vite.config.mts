/// <reference types="vitest" />
import path from "path";
import {defineConfig} from "vite";
import packageJson from "./package.json";

const getPackageName = () => {
  return packageJson.bundle;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, char => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName: any = {
  es: `${getPackageName()}.mjs`,
  iife: `${getPackageName()}.cjs`,
};

const formats: any = Object.keys(fileName) as Array<keyof typeof fileName>;

export default defineConfig({
  base: "./",
  build: {
    outDir: "./dist",
    manifest: 'manifest.json',
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: getPackageNameCamelCase(),
      formats,
      fileName: (format: string) => fileName[format],
    },
    minify: 'terser'
  },
  test: {},
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "@@", replacement: path.resolve(__dirname) },
    ],
  },
});
