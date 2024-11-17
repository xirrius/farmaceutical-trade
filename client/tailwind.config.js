/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#333333",
        secondary: "#767676",
        tertiary: "#414141",
        highlight: "#04DDB2",
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
    },
    screens: {
      xs: "360px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1400px",
      xxxl: "1600px",
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
