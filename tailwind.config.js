/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Financial Theme Colors
        brand: {
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3F51B5', // Primary Indigo
          600: '#3949AB',
          700: '#303F9F',
          800: '#283593',
          900: '#1A237E',
        },
        accent: {
          50: '#FCE4EC',
          100: '#F8BBD0',
          200: '#F48FB1',
          300: '#F06292',
          400: '#EC407A',
          500: '#FF4081', // Secondary Pink
          600: '#F50057',
          700: '#E91E63',
          800: '#C2185B',
          900: '#AD1457',
        },
        // Financial Semantic Colors
        'money-in': {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#00C853', // Success Green
          600: '#00C853',
          700: '#00BFA5',
          800: '#00A896',
          900: '#009688',
        },
        'money-out': {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#D32F2F', // Danger Red
          600: '#F44336',
          700: '#E53935',
          800: '#D32F2F',
          900: '#C62828',
        },
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FFA000', // Warning Amber
          600: '#FF9800',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        info: {
          50: '#E1F5FE',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6',
          500: '#0288D1', // Info Blue
          600: '#039BE5',
          700: '#0288D1',
          800: '#0277BD',
          900: '#01579B',
        },
        // Surface and Background Colors
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E1E1E',
        },
        background: {
          DEFAULT: '#F4F7FE', // Light mode background
          dark: '#121212', // Dark mode background
        },
        // Text Colors
        text: {
          primary: '#2D3748', // Main text
          secondary: '#718096', // Muted text
          inverse: '#FFFFFF',
          'inverse-secondary': '#A0AEC0',
        },
        // Dark Mode Text Colors
        'dark-text': {
          primary: '#FFFFFF',
          secondary: '#A0AEC0',
        },
        // Chart Colors
        chart: {
          income: '#00C853',
          expense: '#D32F2F',
          savings: '#3F51B5',
          investment: '#FF4081',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'financial': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'financial-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'dark-financial': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'financial': '12px',
        'card': '16px',
      },
    },
  },
  plugins: [],
}
