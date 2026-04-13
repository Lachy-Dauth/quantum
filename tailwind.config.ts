import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
