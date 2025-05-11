/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/src/**/*.{js,jsx,ts,tsx}", // Include all source files
    "./client/public/index.html",        // Include the HTML file
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E90FF', // Light blue color
          5: 'rgba(30, 144, 255, 0.05)',
          10: 'rgba(30, 144, 255, 0.1)',
          15: 'rgba(30, 144, 255, 0.15)',
        },
        background: '#F9FAFB', // Define the background color
        foreground: '#1F2937', // Define the foreground color
      },
    },
  },
  plugins: [],
};

