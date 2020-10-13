/* eslint-env node */

module.exports = {
  include: ['src/**.js'],
  require: [require.resolve('@babel/register')],
  sourceMap: false,
  instrument: false,
}
