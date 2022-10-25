module.exports = {
  purge: [
    "./index.html",
    "**/*.{vue,js,ts,jsx,tsx}",
    "../frontend/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
