/* eslint-env node */

module.exports = {
  include: ['bin/*.js', 'util/*.js'],
  require: [require.resolve('@babel/register')],
  sourceMap: false,
  instrument: false,
}
