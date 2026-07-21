import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        navy: "#102A43",
        safety: "#E95D45",
        mist: "#F6F8FB",
      },
      boxShadow: { card: "0 14px 40px rgba(16, 42, 67, 0.08)" },
    },
  },
  plugins: [],
};

export default config;
