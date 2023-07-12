import { extendTheme, theme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const defaultThemeObject = {
  config,
  fonts: {
    body: `DM Sans, ${theme.fonts.body}`,
    heading: `DM Sans, ${theme.fonts.heading}`,
  },
  colors: {
    primary: {
      100: 'gba(112,79,247,0.1)',
      500: 'rgba(112,79,247,0.5)',
    },
    bg: '#e1dafe',
    purple: '#7453FD',
    darkPurple: '#5136C2',
    midnight: '#0F0056',
    green: '#A1F0C4',
    lilac: '#C6B4FC',
    lightLilac: '#E7E2F8',
    red: '#FF5876',
    textPrimary: {
      100: 'rgba(15,0,86,0.8)',
    },
  },
  breakPoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
  shadows: {
    largeSoft: 'rgba(60, 64, 67, 0.15) 0px 2px 10px 6px;',
  },
  components: {
    Button: {
      variants: {
        purple: {
          bg: 'purple',
          borderColor: 'purple',
          color: 'white',
          _hover: {
            bg: 'darkPurple',
          },
          fontWeight: 'normal',
        },
      },
    },
    Progress: {
      variants: {
        green: {
          filledTrack: {
            bg: '#A1F0C4',
          },
        },
        red: {
          filledTrack: {
            bg: '#FF5876',
          },
        },
      },
    },
  },
};

export const defaultTheme = extendTheme(defaultThemeObject);
