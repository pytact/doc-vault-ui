import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Blue + White Theme
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#60A5FA',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#64748B',
          hover: '#475569',
          light: '#94A3B8',
          dark: '#334155',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#F87171',
          dark: '#B91C1C',
        },
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#34D399',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FBBF24',
          dark: '#B45309',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          dark: '#0F172A',
        },
        text: {
          DEFAULT: '#1E293B',
          secondary: '#475569',
          muted: '#64748B',
          light: '#94A3B8',
          dark: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
          dark: '#CBD5E1',
        },
        foreground: {
          DEFAULT: '#1E293B',
        },
      },
      spacing: {
        // 4px grid system
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
};

export default config;

