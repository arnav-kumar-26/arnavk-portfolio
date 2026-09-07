import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#EAE8E2',
          nav: '#EAE8E2',
          dark: '#0A0A09',
        },
        text: {
          primary: '#111110',
          muted: '#83817B',
          inverse: '#F5F4EF',
          'inverse-muted': '#9B9790',
        },
        accent: {
          DEFAULT: '#111110',
          warm: '#C97C4B',
          'warm-light': '#E3A26B',
        },
        border: {
          hairline: '#D3D1C9',
          'hairline-inverse': 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        display: ['Geist', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        namemark: ['"Archivo Black"', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3rem, 6vw + 1.5rem, 8.75rem)', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '500' }],
        h2: ['clamp(2.25rem, 4vw + 1rem, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['clamp(1.375rem, 1vw + 1.125rem, 1.75rem)', { lineHeight: '1.2', fontWeight: '500' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      borderRadius: {
        none: '0px',
        pill: '9999px',
      },
      spacing: {
        section: '9rem',
        gutter: '2rem',
      },
      boxShadow: {
        none: 'none',
      },
      backgroundImage: {
        'footer-scrim': 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0) 40%)',
      },
      letterSpacing: {
        tightest: '-0.02em',
        widest: '0.08em',
      },
      transitionTimingFunction: {
        signature: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        350: '350ms',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
