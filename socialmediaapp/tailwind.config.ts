import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sps_text: "#0d0d0d",
        sps_background: "#ffffff",
        sps_primary: "#c02121",
        sps_secondary: "#e6e6e6",
        sps_accent: "#808080",
      },
    },
  },
  plugins: [],
} satisfies Config;
