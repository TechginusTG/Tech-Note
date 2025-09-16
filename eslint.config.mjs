import nextEslint from "eslint-config-next";

const eslintConfig = [
  nextEslint,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;