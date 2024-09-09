export function cssBaseline() {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          '&::-webkit-scrollbar': {
            width: '0.512rem',
            height: '5px',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ffffff12',
            borderRadius: '8px',
          },
        },
        '#root, #__next': {
          width: '100%',
          height: '100%',

          'textarea:not(.form-control), input:not(.submit):not(.form-control):not([type=submit]):not([type=color]):not([type=reset]):not([type=checkbox]):not([type=radio]):not(.select2-search__field):not(.numInput):not(.tox-textfield)':
            {
              color: 'inherit !importnt',
              backgroundColor: 'inherit !important',
              backgroundClip: 'inherit !important',
              border: 'inherit !important',
              borderRadius: 'inherit !important',
              padding: '16px 14px !important',
            },

          input: {
            '&[type=number]': {
              MozAppearance: 'textfield',
              '&::-webkit-outer-spin-button': {
                margin: 0,
                WebkitAppearance: 'none',
              },
              '&::-webkit-inner-spin-button': {
                margin: 0,
                WebkitAppearance: 'none',
              },
            },
          },
          img: {
            maxWidth: '100%',
            display: 'inline-block',
            verticalAlign: 'bottom',
          },
        },
      },
    },
  }
}
