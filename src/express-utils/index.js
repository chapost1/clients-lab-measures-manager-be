const dumpError = require('../common/dumpError')
const makeExpressCallback = require('./express-callback')
const bodyParserErrorHandler = require('./bodyparser-error-handler')
const makeCustomErrorHandler = require('./custom-error-handler')
const { UNEXPECTED_ERROR_MESSAGE } = require('./error-types')

const expressCallback = makeExpressCallback({ UNEXPECTED_ERROR_MESSAGE })
const customErrorHandler = makeCustomErrorHandler({ dumpError, UNEXPECTED_ERROR_MESSAGE })

module.exports = Object.freeze({
  expressCallback,
  customErrorHandler,
  bodyParserErrorHandler
})
