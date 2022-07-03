module.exports = function makeCustomErrorHandler ({ dumpError, UNEXPECTED_ERROR_MESSAGE }) {
  return function customErrorHandler (error, req, res, next) {
    // res.locals is used for per request isolation variables for app usage: https://expressjs.com/en/api.html#res.locals
    res.locals.handledByCustomErrorHandler = true
    if (res.headersSent) {
      return next(error)
    }
    console.log('custom error handler catch:')
    console.error(dumpError(error))
    // todo: log in to permanent storage
    res.status(500).send(UNEXPECTED_ERROR_MESSAGE)
  }
}
