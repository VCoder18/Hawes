export default {
  theme: {
    extend: {
      // ===== COLORS ONLY =====
      colors: {
        // SEMANTIC BASE COLORS
        primary: '#00b70d',
        'primary-dark': '#009c0a',
        secondary: '#ff5900',
        'secondary-dark': '#E64A19',
        destructive: '#d4183d',

        // TEXT COLORS BY HIERARCHY
        'text-primary': '#0d2805',           // Main content, headings
        'text-secondary': '#334155',         // Navigation, supporting text
        'text-muted': '#6a7282',             // Captions, metadata, helper text
        'text-tertiary': '#475569',          // Alternative neutral text
        'text-disabled': '#cbd5e1',          // Disabled state text
        'text-inverse': '#ffffff',           // Text on dark/colored backgrounds

        // BACKGROUNDS
        'bg-page': '#ffffff',                // Card, modal, default surfaces
        'bg-nav': '#ffffe8',                 // Header, sidebar
        'bg-light': '#f1f5f9',               // Light accents, placeholders, disabled
        'bg-light-accent': '#e2e8f0',        // Subtle backgrounds

        // LIGHT TINTS FOR BACKGROUNDS
        'bg-primary-light': 'rgb(0 183 13 / 0.1)',      // Subtle primary highlighting
        'bg-primary-lighter': 'rgb(0 183 13 / 0.05)',   // Very subtle primary
        'bg-secondary-light': 'rgb(255 89 0 / 0.2)',    // Subtle secondary
        'bg-secondary-lighter': 'rgb(255 89 0 / 0.05)', // Very subtle secondary

        // BORDERS
        'border-default': '#e2e8f0',        // Standard borders
        'border-subtle': '#cbd5e1',         // Subtle, secondary borders
        'border-warm': '#d6d0c4',           // Warm-toned borders
        'border-header': '#ffffc7',         // Header/sidebar borders

        // FOCUS & RINGS
        'ring-primary': '#00b70d',          // Primary focus ring
        'ring-secondary': '#ff5900',        // Secondary focus
        'ring-error': '#d4183d',            // Error focus

        // SPECIAL/CONTEXTUAL
        'accent-warm': '#c4bea9',           // Decorative warm accent

        // OVERLAYS & TRANSPARENCY
        'overlay-dark': 'rgba(0, 0, 0, 0.5)',      // Modal backdrop
        'overlay-warm': 'rgba(229, 225, 220, 0.5)', // Warm overlay
        'overlay-image': 'rgba(0, 0, 0, 0.6)',     // Image text overlay

        // SOCIAL MEDIA BRAND COLORS
        'social-twitter': '#1DA1F2',
        'social-youtube': '#FF0000',
        'social-facebook': '#1877F2',
        'social-instagram': '#E4405F',
        'social-linkedin': '#0A66C2',
      },

      // ===== TYPOGRAPHY ONLY =====
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
      },

      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        display: ['Merriweather', 'serif'],
        heading: ['Lato', 'Inter', 'sans-serif'],
      },

      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },

      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.625',
      },

      letterSpacing: {
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },

  plugins: [
    // Custom text utility classes
    function ({ addComponents }: { addComponents: (components: Record<string, any>) => void }) {
      addComponents({
        '.text-page-heading': {
          '@apply text-5xl font-bold font-display': {},
        },
        '.text-section-heading': {
          '@apply text-3xl font-bold': {},
        },
        '.text-card-title': {
          '@apply text-xl font-bold text-primary': {},
        },
        '.text-form-label': {
          '@apply text-xs font-semibold uppercase tracking-wider text-gray-800': {},
        },
        '.text-body': {
          '@apply text-base font-normal text-gray-950': {},
        },
        '.text-secondary': {
          '@apply text-sm font-normal text-gray-600': {},
        },
        '.text-meta': {
          '@apply text-xs font-semibold uppercase tracking-widest text-gray-500': {},
        },
      });
    },
  ],
};

