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
      keyframes: {
        slideUpFade: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        slideUpFade: 'slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.2s ease-out forwards',
        popIn: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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

