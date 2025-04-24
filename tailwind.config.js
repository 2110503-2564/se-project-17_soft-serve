/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'myred': 'var(--myred)',
        'mygray': 'var(--mygray)',
        'mygreen': 'var(--mygreen)',
      },
    },
  },
  plugins: [],
}