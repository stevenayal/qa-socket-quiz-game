/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-purple': '#b026ff',
                'neon-pink': '#ff2a6d',
                'neon-cyan': '#05d9e8',
                'dark-bg': '#01012b',
                'glass': 'rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                display: ['Orbitron', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: 1, boxShadow: '0 0 20px #b026ff' },
                    '50%': { opacity: .5, boxShadow: '0 0 10px #b026ff' },
                }
            }
        },
    },
    plugins: [],
}
