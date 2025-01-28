// frontend/pluto/tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path based on where your components are located
      "./public/index.html", // Include your HTML files
    ],
    theme: {
      extend: {
        colors: {
          customBlue: '#1234567',
          // Add more custom colors if needed
          primary: '#1a1a1a',
          secondary: '#646cff',
        },
        fontFamily: {
          sans: ['Graphik', 'sans-serif'],
          // Add more font families if needed
        },
        spacing: {
          '128': '32rem',
          // Add more spacing values if needed
        },
        // You can add more theme extensions here
      },
    },
    plugins: [
      require('@tailwindcss/forms'), // Example plugin for better form styles
      require('@tailwindcss/typography'), // Example plugin for typography styles
      // Add more plugins if needed
    ],
  }