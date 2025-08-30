import type { NextConfig } from "next";

const nextConfig: NextConfig =  
  {
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "react/no-unescaped-entities": "off",
    "@next/next/no-head-element": "off",
    "@next/next/no-page-custom-font": "off"
  }
} 
;

export default nextConfig;
