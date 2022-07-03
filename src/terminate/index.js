const makeTerminate = require('./terminate')
const dumpError = require('../common/dumpError')

const terminate = makeTerminate({ dumpError })

module.exports = terminate
