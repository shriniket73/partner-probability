// tailwind.config.js
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontSize: {
          'label': '1.05rem', // You can adjust this value
        }
      }
    },
    // safelist: [
    //   'rounded-md', // Add this line if needed
    //   'rounded-full', // Add more if you need them
    // ],
  }
  