/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'neon-pink': '#FF2E9E',
        'neon-blue': '#00F0FF',
        'neon-yellow': '#FFEB3B',
        'neon-green': '#39FF14',
        'neon-purple': '#BF00FF',
        'bg-deep': '#0D0B1F',
        'bg-card': '#1A1635',
        'bg-card-hover': '#241E49',
        'border-neon': '#2D2654',
        'border-neon-light': '#4A3F85',
      },
      fontFamily: {
        'display': ['"ZCOOL KuaiLe"', 'cursive', 'sans-serif'],
        'body': ['"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 10px #FF2E9E, 0 0 20px rgba(255, 46, 158, 0.5), 0 0 40px rgba(255, 46, 158, 0.3)',
        'neon-blue': '0 0 10px #00F0FF, 0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)',
        'neon-yellow': '0 0 10px #FFEB3B, 0 0 20px rgba(255, 235, 59, 0.5), 0 0 40px rgba(255, 235, 59, 0.3)',
        'card-glow': '0 4px 30px rgba(255, 46, 158, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #FF2E9E 0%, #BF00FF 50%, #00F0FF 100%)',
        'gradient-pink-yellow': 'linear-gradient(135deg, #FF2E9E 0%, #FFEB3B 100%)',
        'gradient-blue-purple': 'linear-gradient(135deg, #00F0FF 0%, #BF00FF 100%)',
        'grid-transparent': 'linear-gradient(45deg, #1A1635 25%, transparent 25%), linear-gradient(-45deg, #1A1635 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1A1635 75%), linear-gradient(-45deg, transparent 75%, #1A1635 75%)',
      },
      backgroundSize: {
        'grid-20': '20px 20px',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'bounce-heart': 'bounceHeart 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 10px #FF2E9E, 0 0 20px rgba(255, 46, 158, 0.5)' },
          '50%': { boxShadow: '0 0 20px #FF2E9E, 0 0 40px rgba(255, 46, 158, 0.7), 0 0 60px rgba(255, 46, 158, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounceHeart: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
