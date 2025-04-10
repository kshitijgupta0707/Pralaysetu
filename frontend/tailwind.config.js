// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens: {
          'xx': { 'max': '380px' }, // 0 to 380px only
        },
      },
    },
    plugins: [],
  }
  