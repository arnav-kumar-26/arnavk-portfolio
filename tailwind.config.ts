import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--color-brand-gray)',
          nav: 'var(--color-brand-gray)',
          dark: 'var(--color-brand-black)',
        },
        text: {
          primary: 'var(--color-neutral-900)',
          secondary: 'var(--color-neutral-800)',
          muted: 'var(--color-neutral-500)',
          inverse: 'var(--color-neutral-100)',
          'inverse-muted': 'var(--color-neutral-300)',
          brown: '#5C4033',
        },
        accent: {
          DEFAULT: 'var(--color-neutral-900)',
          hover: 'var(--color-neutral-700)',
          warm: '#C97C4B',
          'warm-light': '#E3A26B',
        },
        border: {
          hairline: 'var(--color-border-hairline)',
          'hairline-inverse': 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        display: ['Geist', 'Arial', 'sans-serif'],
        mono: ['"PT Mono"', 'sans-serif'],
        namemark: ['Geist', 'Arial', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3rem, 12vw + 0.5rem, var(--font-size-display))', { lineHeight: '0.9', letterSpacing: '-0.06em', fontWeight: '900' }],
        h2: ['clamp(3rem, 8vw + 1rem, var(--font-size-7xl))', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '600' }],
        h3: ['clamp(1.375rem, 1.5vw + 0.875rem, var(--font-size-3xl))', { lineHeight: '1.2', letterSpacing: '-0.035em', fontWeight: '500' }],
        h4: ['clamp(1.5rem, 1vw + 1.25rem, var(--font-size-2xl))', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        h5: ['clamp(1.25rem, 0.75vw + 1.0625rem, var(--font-size-lg))', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h6: ['clamp(1rem, 0.5vw + 0.875rem, var(--font-size-base))', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        body: ['var(--font-size-base)', { lineHeight: '1.65' }],
        label: ['var(--font-size-xs)', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
        xs: ['var(--font-size-xs)', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
        nav: ['clamp(1.125rem, 0.5vw + 1rem, var(--font-size-lg))', { lineHeight: '1.2' }],
      },
      borderRadius: {
        none: '0px',
        pill: '9999px',
        button: 'var(--radius-sm)',
      },
      spacing: {
        section: 'var(--space-xxl)',
        'section-lg': 'var(--space-xxl)',
        gutter: 'var(--space-md)',
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
        signature: 'var(--ease-signature)',
      },
      transitionDuration: {
        350: 'var(--dur-base)',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp var(--dur-entrance) var(--ease-signature) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
