/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 120,
  semi: true,
  singleQuote: false,
  proseWrap: "always",
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss", // MUST come last
  ],
  tailwindConfig: "./app/tailwind.config.ts",
  tailwindFunctions: ["clsx"],
};
export default config;
