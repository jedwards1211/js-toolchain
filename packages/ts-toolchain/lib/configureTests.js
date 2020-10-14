const { dependencies } = require('../package.json')

if (dependencies['jsdom-global']) {
  require('jsdom-global/register')
}
if (dependencies['enzyme']) {
  const { configure } = require('enzyme')
  const Adapter = require('enzyme-adapter-react-16')
  configure({ adapter: new Adapter() })
}

require('@babel/register')({ extensions: ['.js', '.jsx', '.ts', '.tsx'] })
