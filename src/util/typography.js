import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.45,
  bodyFontFamily: ['Istok Web', 'sans-serif'],
  headerFontFamily: ['Enriqueta', 'serif'],
  overrideStyles: () => ({
    a: {
      color: '#1f8dba',
    },
  }),
});

export default typography;
