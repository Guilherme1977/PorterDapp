/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        white: '#e0e0e0',
        'base-100': '#131415',
      },
      maxWidth: {
        '8xl': '85rem',
      },
      fontSize: {
        xxs: [
          '10px',
          {
            letterSpacing: '0.1em',
            fontWeight: 400,
          },
        ],
        xs: [
          '12px',
          {
            letterSpacing: '0.1em',
            fontWeight: 400,
          },
        ],
        sm: [
          '13px',
          {
            letterSpacing: '0.1em',
            fontWeight: 400,
          },
        ],
        '2sm': [
          '14px',
          {
            letterSpacing: '0.1em',
            fontWeight: 400,
          },
        ],
        base: [
          '16px',
          {
            letterSpacing: '0.06em',
            fontWeight: 400,
          },
        ],
        xl: [
          '22px',
          {
            letterSpacing: '0.01em',
          },
        ],
        '2xl': [
          '23px',
          {
            letterSpacing: '0.06em',
          },
        ],
        '3xl': [
          '26px',
          {
            letterSpacing: '0.05em',
          },
        ],
        '4xl': [
          '32px',
          {
            letterSpacing: '0.05em',
          },
        ],
      },
      fontFamily: {
        sans: ['Neue Haas Grotesk Display', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [require('daisyui'), require('tailwind-scrollbar')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          'base-100': '#131415',
        },
      },
    ],
  },
  darkMode: 'class',
}
