import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#E9F1FA',
        'bright-blue': '#00ABE4',
        'white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      backgroundColor: {
        'bright-blue': '#00ABE4',
        'light-blue': '#E9F1FA',
      },
      textColor: {
        'bright-blue': '#00ABE4',
      },
      borderColor: {
        'bright-blue': '#00ABE4',
      },
    },
  },
  plugins: [],
};

export default config;
