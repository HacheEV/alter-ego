
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Inter: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: '#151515',
        whiteBorder: '#E5E5E5',
        select1: '#33539E',
        select2: '#7FACD6',
        select3: '#BFB8DA',
        select4: '#E8B7DA',
        select5: '#A5678E'
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
