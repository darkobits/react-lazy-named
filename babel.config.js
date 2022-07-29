/**
 * See: https://github.com/babel/babel
 */
module.exports = {
  extends: require('@darkobits/ts').babel,
  // Add your own Babel configuration here.
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};
