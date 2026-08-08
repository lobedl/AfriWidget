/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './**/*.html',
    './*.js',
    './**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'brand-teal': '#0F766E',
        'brand-emerald': '#10B981',
        'brand-dark': '#0F172A'
      }
    }
  },
  plugins: []
};
