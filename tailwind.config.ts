import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',         // Scanning all page files with TypeScript and TSX
    './src/components/**/*.{ts,tsx}',    // Scanning all component files with TypeScript and TSX
    './src/app/**/*.{ts,tsx}',           // Scanning app directory with TypeScript and TSX
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)', // Custom CSS variables for background color
        foreground: 'var(--foreground)', // Custom CSS variables for foreground color
      },
    },
  },
  plugins: [],
};

export default config;
