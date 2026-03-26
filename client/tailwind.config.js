/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        "primary-hover": "#818cf8",
        secondary: "#EF863E",
        // Dark mode surfaces
        dark: {
          bg: "#0f1117",
          surface: "#1a1d2e",
          surface2: "#222639",
          border: "#2d3154",
          muted: "#64748b",
        },
      },
      boxShadow: {
        "card-dark": "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5)",
        "card-hover-dark": "0 4px 16px rgba(0,0,0,0.5)",
        "card-light": "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover-light": "0 8px 24px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
}
