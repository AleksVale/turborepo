import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    extends: ["js/recommended"],
  },

  // Configuração base do TypeScript
  {
    ...tseslint.configs.recommended,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname, // raiz do monorepo
      },
    },
  },

  // React (para apps frontend)
  {
    ...pluginReact.configs.flat.recommended,
  },

  // Override específico para o backend
  {
    files: ["apps/backend/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./apps/backend/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Override específico para o web
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./apps/web/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
