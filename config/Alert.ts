import { alertAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const custom = definePartsStyle(props => {
  const { status } = props;

  return {
    container: {
      borderColor: status === 'error' ? 'red.100' : 'green',
      bg: status === 'error' ? 'red.100' : 'green',
    },
    icon: {
      color: status === 'error' ? 'red.500' : 'green.500',
    },
  };
});

const variants = {
  custom,
};

export const alertTheme = defineMultiStyleConfig({
  variants,
  defaultProps: {
    variant: 'custom',
  },
});
