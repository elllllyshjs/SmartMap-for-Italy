import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        italy: {
          green: "#008C45",
          white: "#F4F5F0",
          red: "#CD212A",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
