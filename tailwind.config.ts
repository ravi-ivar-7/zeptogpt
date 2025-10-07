import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
     screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        moveRight: "moveRight 1s ease-in-out infinite alternate",
        moveLeft: "moveLeft 1s ease-in-out infinite alternate",
        moveUp: "moveUp 1s ease-in-out infinite alternate",
        moveDown: "moveDown 1s ease-in-out infinite alternate",
      },
      keyframes: {
        moveRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(5px)" },
        },
        moveLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-5px)" },
        },
        moveUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-10px)" },
        },
        moveDown: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(5px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;