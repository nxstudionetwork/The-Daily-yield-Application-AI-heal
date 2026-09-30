/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './frontend/**/*.tsx',
    './frontend/**/*.ts',
    './frontend/**/*.js',
    './frontend/**/*.jsx',
    './frontend-vanilla/**/*.html',
    './frontend-vanilla/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(260, 100%, 60%)',
        "accent-bg": 'hsl(260, 100%, 10%, 0.1)',
        "accent-border": 'hsl(260, 100%, 50%, 0.5)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
