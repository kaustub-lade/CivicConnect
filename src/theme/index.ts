import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Color theme config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Professional Civic Trust Palette
const colors = {
  brand: {
    50: '#EFF6FF',   // Lightest blue
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB',  // Primary Civic Blue
    600: '#1D4ED8',
    700: '#1E3A8A',  // Authority Blue (Dark)
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // Progress Green
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // Action Amber
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',  // Issue Red
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  gray: {
    50: '#F8FAFC',   // Background
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  // Status colors for consistency
  status: {
    submitted: '#64748B',   // Gray
    verified: '#2563EB',     // Blue
    assigned: '#7C3AED',     // Purple
    inProgress: '#F59E0B',   // Amber
    resolved: '#10B981',     // Green
    escalated: '#EF4444',    // Red
  },
};

// Typography system
const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
};

const fontSizes = {
  xs: '0.75rem',    // 12px - Caption
  sm: '0.875rem',   // 14px - Body Small
  md: '1rem',       // 16px - Body Large
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px - H3
  '2xl': '1.5rem',  // 24px - H2
  '3xl': '2rem',    // 32px - H1
  '4xl': '2.5rem',
  '5xl': '3rem',
};

const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Spacing system (8px rule)
const space = {
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px - Small gap
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px - Normal spacing
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px - Section spacing
  8: '2rem',        // 32px - Large separation
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-2px)',
          shadow: 'lg',
        },
        _active: {
          bg: 'brand.700',
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
      ghost: {
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
      danger: {
        bg: 'danger.500',
        color: 'white',
        _hover: {
          bg: 'danger.600',
        },
      },
    },
    defaultProps: {
      colorScheme: 'brand',
    },
  },
  Badge: {
    baseStyle: {
      fontWeight: 'semibold',
      fontSize: 'xs',
      borderRadius: 'full',
      px: 3,
      py: 1,
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
      },
      subtle: {
        bg: 'brand.100',
        color: 'brand.700',
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'white',
        borderRadius: 'xl',    // 12px
        boxShadow: 'sm',
        p: 5,                  // 20px padding
      },
    },
  },
  Heading: {
    baseStyle: {
      color: 'gray.900',
      fontWeight: 'bold',
    },
    sizes: {
      xl: {
        fontSize: '3xl',      // 32px - H1
        lineHeight: '1.2',
      },
      lg: {
        fontSize: '2xl',      // 24px - H2
        lineHeight: '1.3',
      },
      md: {
        fontSize: 'xl',       // 20px - H3
        lineHeight: '1.4',
      },
    },
  },
  Text: {
    baseStyle: {
      color: 'gray.700',
    },
    variants: {
      secondary: {
        color: 'gray.600',
      },
      caption: {
        fontSize: 'xs',
        color: 'gray.500',
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'lg',
      },
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: 'lg',
      },
    },
  },
  Textarea: {
    baseStyle: {
      borderRadius: 'lg',
    },
  },
};

// Global styles
const styles = {
  global: {
    body: {
      bg: 'gray.50',        // #F8FAFC background
      color: 'gray.900',    // #111827 primary text
    },
    a: {
      color: 'brand.500',
      _hover: {
        textDecoration: 'underline',
      },
    },
  },
};

// Semantic tokens for dark mode support (future)
const semanticTokens = {
  colors: {
    'bg-surface': {
      default: 'white',
      _dark: 'gray.800',
    },
    'bg-canvas': {
      default: 'gray.50',
      _dark: 'gray.900',
    },
    'text-primary': {
      default: 'gray.900',
      _dark: 'white',
    },
    'text-secondary': {
      default: 'gray.600',
      _dark: 'gray.400',
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  fontSizes,
  fontWeights,
  space,
  components,
  styles,
  semanticTokens,
});

export default theme;
