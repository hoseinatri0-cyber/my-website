/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF5FF',
          100: '#DBE8FE',
          200: '#BFD6FE',
          300: '#93BAFD',
          400: '#6094FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4FD8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        navy: {
          50: '#F4F6FA',
          100: '#E7EBF3',
          700: '#1B2A44',
          800: '#152238',
          900: '#101B2D',
          950: '#0A1424',
        },
        ink: '#111827',
        muted: '#6B7280',
        line: '#E5E7EB',
        surface: '#F5F7FB',
        success: '#16A34A',
        discount: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 27, 45, 0.04), 0 8px 24px -12px rgba(16, 27, 45, 0.12)',
        lift: '0 18px 40px -18px rgba(16, 27, 45, 0.28)',
        soft: '0 1px 3px rgba(16, 27, 45, 0.06)',
      },
      borderRadius: {
        xl2: '14px',
      },
      maxWidth: {
        container: '1280px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'toast-in': 'toast-in 0.2s ease-out both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}
