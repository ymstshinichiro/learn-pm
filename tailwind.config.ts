import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F5FA',
          100: '#CCE8F3',
          200: '#99D2E7',
          300: '#66BBDB',
          400: '#33A5CF',
          500: '#169DCB', // Main primary color
          600: '#127EA2',
          700: '#0D5E7A',
          800: '#093F51',
          900: '#041F29',
        },
        secondary: {
          50: '#FDFDF0',
          100: '#FAFAE0',
          200: '#F5F5C2',
          300: '#F0F0A3',
          400: '#EBEB85',
          500: '#DCDC30', // Main secondary color
          600: '#B0B026',
          700: '#84841D',
          800: '#585813',
          900: '#2C2C0A',
        },
        accent: {
          50: '#FCE8EB',
          100: '#F9D1D7',
          200: '#F3A3AF',
          300: '#ED7587',
          400: '#E7475F',
          500: '#DC1B2E', // Main accent color
          600: '#B01625',
          700: '#84101B',
          800: '#580B12',
          900: '#2C0509',
        },
        neutral: {
          50: '#FDFDFD',
          100: '#F9F9F9', // Main neutral color
          200: '#F5F5F5',
          300: '#E5E5E5',
          400: '#D4D4D4',
          500: '#A3A3A3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
