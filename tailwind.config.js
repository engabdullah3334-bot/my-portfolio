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
          bg:      '#0a0e1a',
          surface: '#0f1629',
          card:    '#131d35',
          border:  '#1e2d4d',
          cyan:    '#00d4ff',
          teal:    '#00b4a0',
          blue:    '#3b82f6',
          purple:  '#8b5cf6',
          emerald: '#10b981',
          glow:    'rgba(0, 212, 255, 0.15)',
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
          from: { boxShadow: '0 0 10px rgba(0,212,255,0.25), 0 0 20px rgba(0,212,255,0.08)' },
          to:   { boxShadow: '0 0 25px rgba(0,212,255,0.55), 0 0 45px rgba(0,212,255,0.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        typewriter: {
          from: { width: '0' },
          to:   { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%':      { borderColor: '#00d4ff' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,212,255,0.035) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,212,255,0.035) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
