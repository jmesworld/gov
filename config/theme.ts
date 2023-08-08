import { extendTheme, theme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};
import { alertTheme } from './Alert';
export const defaultThemeObject = {
  config,

  fonts: {
    body: `DM Sans, ${theme.fonts.body}`,
    heading: `DM Sans, ${theme.fonts.heading}`,
  },
  colors: {
    skeleton: {
      100: '#e1dafe',
      200: '#afa9c6',
    },
    primary: {
      100: 'gba(112,79,247,0.1)',
      500: 'rgba(112,79,247,0.5)',
    },
    yellow: '#ffd100',
    white: '#fff',
    bg: '#e1dafe',
    purple: '#7453FD',
    brand: '#7453FD',
    darkPurple: '#5136C2',
    midnight: '#0F0056',
    green: '#A1F0C4',
    lilac: '#C6B4FC',
    lightLilac: '#E7E2F8',
    red: '#FF5876',
    'red.50': '#ffe2e9',
    'red.100': '#ffb1bf',
    'red.200': '#ff7f96',
    'red.300': '#ff4d6d',
    'red.400': '#fe1d43',
    'red.500': '#e5062a',
    'red.600': '#b30020',
    'red.700': '#810017',
    'red.800': '#4f000c',
    'red.900': '#200004',
    'green.50': '#e2fdee',
    'green.100': '#baf5d5',
    'green.200': '#91edba',
    'green.300': '#67e69f',
    'green.400': '#3fdf84',
    'green.500': '#28c66a',
    'green.600': '#1d9a53',
    'green.700': '#126e3a',
    'green.800': '#064222',
    'green.900': '#001808',

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
    Alert: alertTheme,
    Switch: {
      variants: {
        secondary: {
          container: {
            borderRadius: 'full',
            borderWidth: '1px',
            borderColor: 'purple',
          },
          track: {
            bg: 'gray.100',
            _checked: {
              bg: 'green',
            },
          },
          thumb: {
            bg: 'purple',
          },
        },
      },
    },
    Button: {
      variants: {
        purpleText: {
          bg: 'transparent',
          borderColor: 'transparent',
          color: 'purple',
          _hover: {
            bg: 'transparent',
            color: 'darkPurple',
          },
          fontWeight: 'normal',
        },
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

export const defaultTheme = extendTheme({ ...defaultThemeObject, config });
