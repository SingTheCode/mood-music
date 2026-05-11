import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#533afd',
          deep: '#4434d4',
          press: '#2e2b8c',
          soft: '#665efd',
          subdued: '#b9b9f9',
        },
        'brand-dark': '#1c1e54',
        ruby: '#ea2261',
        magenta: '#f96bee',
        lemon: '#9b6829',

        canvas: {
          DEFAULT: '#ffffff',
          soft: '#f6f9fc',
          cream: '#f5e9d4',
        },
        hairline: {
          DEFAULT: '#e3e8ee',
          input: '#a8c3de',
        },

        ink: {
          DEFAULT: '#0d253d',
          secondary: '#273951',
          mute: '#64748d',
          'mute-2': '#61718a',
        },
        'on-primary': '#ffffff',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px',
      },

      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        huge: '64px',
      },

      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-xxl': ['56px', { lineHeight: '1.03', letterSpacing: '-1.4px', fontWeight: '300' }],
        'display-xl': ['48px', { lineHeight: '1.15', letterSpacing: '-0.96px', fontWeight: '300' }],
        'display-lg': ['32px', { lineHeight: '1.1', letterSpacing: '-0.64px', fontWeight: '300' }],
        'display-md': ['26px', { lineHeight: '1.12', letterSpacing: '-0.26px', fontWeight: '300' }],
        'heading-lg': ['22px', { lineHeight: '1.1', letterSpacing: '-0.22px', fontWeight: '300' }],
        'heading-md': ['20px', { lineHeight: '1.4', letterSpacing: '-0.2px', fontWeight: '300' }],
        'heading-sm': ['18px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '300' }],
        'body-lg': ['16px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '300' }],
        'body-md': ['15px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '300' }],
        'body-tabular': ['14px', { lineHeight: '1.4', letterSpacing: '-0.42px', fontWeight: '300' }],
        'button-md': ['16px', { lineHeight: '1.0', letterSpacing: '0', fontWeight: '400' }],
        'button-sm': ['14px', { lineHeight: '1.0', letterSpacing: '0', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.4', letterSpacing: '-0.39px', fontWeight: '400' }],
        micro: ['11px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '300' }],
        'micro-cap': ['10px', { lineHeight: '1.15', letterSpacing: '0.1px', fontWeight: '400' }],
      },
      fontWeight: {
        thin: '300',
        normal: '400',
      },

      boxShadow: {
        'level-1': 'rgba(0,55,112,0.08) 0 1px 3px',
        'level-2': 'rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
