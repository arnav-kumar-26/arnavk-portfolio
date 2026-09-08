import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#e6e6e6',
          nav: '#e6e6e6',
          dark: '#0f0f0f',
        },
        text: {
          primary: '#1e1e1f',
          secondary: '#29292b',
          muted: '#7f7f80',
          inverse: '#f2f2f2',
          'inverse-muted': '#a9a9aa',
        },
        accent: {
          DEFAULT: '#1e1e1f',
          hover: '#545455',
          warm: '#C97C4B',
          'warm-light': '#E3A26B',
        },
        border: {
          hairline: '#bfbfbf',
          'hairline-inverse': 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        display: ['Geist', 'Arial', 'sans-serif'],
        mono: ['"PT Mono"', 'sans-serif'],
        namemark: ['Geist', 'Arial', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3rem, 12vw + 0.5rem, 11.2rem)', { lineHeight: '0.9', letterSpacing: '-0.06em', fontWeight: '500' }],
        h2: ['clamp(2rem, 4vw + 0.875rem, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '600' }],
        h3: ['clamp(1.375rem, 1.5vw + 0.875rem, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.035em', fontWeight: '500' }],
        h4: ['clamp(1.5rem, 1vw + 1.25rem, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        h5: ['clamp(1.25rem, 0.75vw + 1.0625rem, 1.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h6: ['clamp(1rem, 0.5vw + 0.875rem, 1.125rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        body: ['1.125rem', { lineHeight: '1.6' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
        nav: ['clamp(1.125rem, 0.5vw + 1rem, 1.44rem)', { lineHeight: '1.2' }],
      },
      borderRadius: {
        none: '0px',
        pill: '9999px',
        button: '5px',
      },
      spacing: {
        section: '10rem',
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
        body: '-0.03em',
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
