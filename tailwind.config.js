/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins : ['"poppins"', "sans-serif"],
        dmSerifDisplay : ['"DM Serif Display"', "serif"],
        darkerGrotesque : ['"Darker Grotesque"', "sans-serif"],
      },
      colors : {
        GreenHerb : "#A6D577",
        IjoRumput : "#85997D",
        darkGreenHerb : "#5D6B58",
        AbuIjo : "#C1C1C3",
        iceGray : "#EBEBEB",
        hoverGray : "#D9D9D9",
        primaryColor : "#127ec3",
        secondaryColor : "#e86412",
        thirdColor : "#85c442",
        fouthColor : "#04256c",
        inputColor : "#216ff3",
        inputHoverColor : "#1a62dd",
        iconHoverColor : "#ffb700",
        submitColor : "#23a455",
        submitHoverColor : "#1e8a48",
        cancelColor : "#E8273B",
        cancelColorHover : "#CB273B",
      },
      backgroundImage: {
        'gradient-radial' : 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

