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
    extend: {
      fontFamily: {
        sans: ['var(--font-dmsans)', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['DM Mono', 'monospace'],
        human: ['Mukta Malar', 'sans-serif'],
      },
    }
  },
  plugins: [],
  
}