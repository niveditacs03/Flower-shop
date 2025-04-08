/** @type {import('tailwindcss').Config} */
module.exports = {
    // Enable JIT (Just-In-Time) mode for better performance
    mode: 'jit',
    
    // Specify files to scan for classes
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    
    theme: {
      extend: {
        colors: {
          // Main theme colors
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#2563EB', // Primary blue
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          secondary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22C55E', // Primary green
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          neutral: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
          },
        },
        
        // Custom font families
        fontFamily: {
          sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          display: ['Plus Jakarta Sans', 'sans-serif'],
        },
        
        // Custom spacing
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
        },
        
        // Custom border radius
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
          '3xl': '2rem',
        },
        
        // Custom box shadows
        boxShadow: {
          'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          'card': '0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.10)',
          'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        
        // Animation durations
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.5s ease-out',
        },
        
        // Custom keyframes
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        
        // Screen breakpoints
        screens: {
          'xs': '475px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
    },
    
    // Add plugins
    plugins: [
      require('@tailwindcss/forms')({
        strategy: 'class',
      }),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/line-clamp'),
    ],
    
    // Customize variants
    variants: {
      extend: {
        opacity: ['disabled'],
        cursor: ['disabled'],
        backgroundColor: ['active', 'hover', 'focus'],
        borderColor: ['active', 'hover', 'focus'],
        textColor: ['active', 'hover', 'focus'],
        ring: ['active', 'hover', 'focus'],
      },
    },
  };