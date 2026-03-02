/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        themedark: "#9D00FF",
        themelight: "#FFFFFF80",
        themeblack: "#141414",
      },
      screens: {
        'sx': "424px",
        sm: "575px",
        md: "768px",
        lg: "1023px",
        xl: "1200px",
        '2xl': "1440px",
        '3xl': "1620px",
        '4xl': "1820px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add plugin for scrollbar hiding
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
}

