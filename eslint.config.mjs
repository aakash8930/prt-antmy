import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  { ignores: [".next/**", "node_modules/**", "source.mp4", "v*.mp4", "public/sequence/**"] },
];

export default eslintConfig;
