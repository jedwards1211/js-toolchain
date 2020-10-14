/* eslint-env node */

module.exports = {
  include: ['src/**.js', 'src/**.ts', 'src/**.tsx'],
  require: [require.resolve('@babel/register')],
  sourceMap: false,
  instrument: false,
}
