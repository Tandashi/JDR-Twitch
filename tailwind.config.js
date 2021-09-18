const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    ripple: (theme) => ({
      colors: theme('colors'),
    }),

    flex: {
      1: '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none',
      10: '1 1 10%',
      20: '1 1 20%',
      30: '1 1 30%',
      40: '1 1 40%',
      50: '1 1 50%',
      60: '1 1 60%',
      70: '1 1 70%',
      80: '1 1 80%',
      90: '1 1 90%',
    },

    flexGrow: {
      0: 0,
      DEFAULT: 1,
      2: 2,
      4: 4,
    },

    extend: {
      screens: {
        'retina-192': {
          raw: 'screen and (-webkit-min-device-pixel-ratio: 2), screen and (min-resolution: 192dpi), screen and (min-resolution: 2dppx)',
        },
        'retina-144': {
          raw: 'screen and (-webkit-min-device-pixel-ratio: 1.5), screen and (min-resolution: 144dpi), screen and (min-resolution: 1.5dppx)',
        },
        'retina-120': {
          raw: 'screen and (-webkit-min-device-pixel-ratio: 1.25), screen and (min-resolution: 120dpi), screen and (min-resolution: 1.25dppx)',
        },
      },
    },
  },
  purge: {
    enabled: false,
  },
  plugins: [require('tailwindcss-ripple')()],
};
