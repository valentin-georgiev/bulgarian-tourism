import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Disables ESLint rules that would conflict with Prettier formatting.
  // Must come after other configs so it can override them.
  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "types/**"
  ]),

  {
    files: ["./**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // --- Import formatting ---
      "import/newline-after-import": ["error", { count: 1 }],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "type",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          "newlines-between": "never",
          pathGroups: [
            { pattern: "@components/**", group: "internal" },
            { pattern: "@hooks/**", group: "internal" },
            { pattern: "@utils/**", group: "internal" },
            { pattern: "types", group: "internal" },
          ],
        },
      ],

      // --- React ---
      "react-hooks/rules-of-hooks": "error",
      "react/no-array-index-key": "error",
      "react/no-typos": "warn",

      // --- Unused vars / imports ---
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",

      // --- TypeScript ---
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-extra-semi": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["PascalCase", "camelCase", "UPPER_CASE", "snake_case"],
          leadingUnderscore: "allow",
        },
        {
          selector: "parameter",
          format: ["camelCase", "snake_case"],
          leadingUnderscore: "allow",
        },
        {
          selector: "property",
          format: null,
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase", "UPPER_CASE"],
        },
      ],

      // --- Misc ---
      "no-undef": "off",
    },
  },
]);

export default eslintConfig;
