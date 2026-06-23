/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'win-teal': '#008080',
        'win-gray': '#c0c0c0',
        'win-title': '#000080',
        'win-title-active': '#0000a0',
        'win-white': '#ffffff',
        'win-dark': '#808080',
        'win-darker': '#404040',
        'win-black': '#000000',
      },
      fontFamily: {
        sans: ['Tahoma', 'MS Sans Serif', 'Arial', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        'win-outset': 'inset -1px -1px 0 0 #000, inset 1px 1px 0 0 #fff, inset -2px -2px 0 0 #808080, inset 2px 2px 0 0 #dfdfdf',
        'win-inset': 'inset 1px 1px 0 0 #000, inset -1px -1px 0 0 #fff, inset 2px 2px 0 0 #808080, inset -2px -2px 0 0 #dfdfdf',
        'win-button': 'inset -1px -1px 0 0 #000, inset 1px 1px 0 0 #fff',
        'win-button-pressed': 'inset 1px 1px 0 0 #000, inset -1px -1px 0 0 #fff',
      },
    },
  },
  plugins: [],
}
