const
  baseSize = 8,
  borderRadius = 2,
  borderWidth = 1;

export default {
    colors: {
      main: '#375362',
      electricBlue: '#e4e9ee',
      'glassDarkCoral': 'rgba(211, 76, 76, 0.1)',
    },
    sizes: {
      borderRadius: `${borderRadius}px`,
      base: `${baseSize}px`,
      xs: `${baseSize / 2}px`,
      md: `${baseSize * 2}px`,
      lg: `${baseSize * 3}px`,
      xl: `${baseSize * 4}px`,
      xxl: `${baseSize * 5}px`,
      borderWidth: `${borderWidth}px`,
    },
  };
