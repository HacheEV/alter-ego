module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#151515',
        whiteBorder: '#E5E5E5'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
