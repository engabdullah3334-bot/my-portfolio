/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      colors: {
        cyber: {
          bg:      '#08090b',
          surface: '#0f1115',
          card:    '#14171d',
          border:  '#20242c',
          cyan:    '#38bdf8',
          teal:    '#0ea5e9',
          blue:    '#2563eb',
          purple:  '#94a3b8',
          emerald: '#10b981',
          glow:    'rgba(56, 189, 248, 0.08)',
        },
      },
      animation: {
        'fade-in-up':    'fadeInUp 0.8s ease forwards',
        'fade-in-right': 'fadeInRight 0.8s ease forwards',
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'spin-slow':     'spin 16s linear infinite',
        'border-glow':   'borderGlow 2.5s ease-in-out infinite alternate',
        'float':         'float 6s ease-in-out infinite',
        'typewriter':    'typewriter 3s steps(30) forwards',
        'blink':         'blink 1s step-end infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        borderGlow: {
          from: { boxShadow: '0 0 10px rgba(56,189,248,0.08)' },
          to:   { boxShadow: '0 0 20px rgba(56,189,248,0.18)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        typewriter: {
          from: { width: '0' },
          to:   { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%':      { borderColor: '#38bdf8' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
}
