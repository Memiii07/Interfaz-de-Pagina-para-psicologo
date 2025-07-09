/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { // 👇 Colores personalizados
        primary: {
          50: '#f0f4ff',  // Azul muy claro
          100: '#e0e9fa',
          400: '#7e9ef7',  // Azul pastel
          600: '#5a78c4',  // Azul profesional
        },
        secondary: {
          50: '#f5f3ff',  // Lavanda claro
          200: '#d8c6ff',
          500: '#8b5cf6',  // Morado pastel
        },
        accent: {
          100: '#dcfce7',  // Verde menta
          400: '#4ade80',
        },
        gray: {
          50: '#f9fafb',   // Gris neutro claro
          200: '#e5e7eb',
        },
        purple: {
      50: '#FAF5FF',
      500: '#8B5CF6',
      700: '#6D28D9',
        },
        green: {
          100: '#D1FAE5',
      500: '#10B981',
        }
      },
    },
  },
  plugins: [],
}