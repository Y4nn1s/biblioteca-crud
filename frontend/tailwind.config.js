/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5', // Indigo 600
                secondary: '#1e293b', // Slate 800
            }
        },
    },
    plugins: [],
}
