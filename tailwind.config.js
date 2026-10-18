/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'board-light': '#EEEED2',
        'board-dark': '#769656',
        'board-highlight': 'rgba(250, 204, 21, 0.5)',
      },
    },
  },
  plugins: [],
};
