/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'white': '#ffffff',
      'black': '#000000',
      'dark-gray': '#1F1B21',
      'gray': '#29252B',
      'muted-gray': '#59555B',
      'light-gray': '#D1CDD3',
      'lighter-gray': '#EDE9EF',
      'ghost': '#DFDBE0',
      'accent': '#9623B9',
      'accent-highlight': '#C7A6E3',
      'err': '#C25561',
      'valid': '#18C223'
    },
    extend: {
      fontFamily: { 
        "gasoek": ['Gasoek One', 'sans-serif'] 
      },
      scale: {
        '300': '3',
        '250': '2.5'
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))'
      },
      gridTemplateRows: {
        '15': 'repeat(15, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))'
      }
    },
  },
  safelist: [
    'grid-cols-7',
    'grid-cols-10',
    'grid-cols-15',
    'grid-cols-20',
    'grid-cols-25',
    'grid-rows-7',
    'grid-rows-10',
    'grid-rows-15',
    'grid-rows-20',
    'grid-rows-25',
  ],
  plugins: [],
}

