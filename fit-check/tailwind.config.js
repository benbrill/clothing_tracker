/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
    sans: ['DM Sans', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
    mono: ['DM Mono', 'monospace'],
  },
    extend: {},
  },
  plugins: [],
  
}