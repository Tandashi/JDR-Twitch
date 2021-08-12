module.exports = {
  theme: {
    ripple: theme => ({
      colors: theme('colors')
    }),

    flex: {
      '1': '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none',
      '20': '1 1 20%',
      '30': '1 1 30%',
      '70': '1 1 70%',
      '80': '1 1 80%'
    },
    flexGrow: {
      '0': 0,
      DEFAULT: 1,
      '2': 2,
      '4': 4
    }
  },
  purge: {
    enabled: false
  },
  plugins: [
    require('tailwindcss-ripple')()
  ]
}