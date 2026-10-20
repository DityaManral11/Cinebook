/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { cine: { bg: '#09090d', panel: '#14141c', red: '#f04452' } } } },
  plugins: [],
};
