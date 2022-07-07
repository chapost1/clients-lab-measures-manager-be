const { DbApplicationError, DbConflictError, DbInvalidError } = require('../../../common/custom-error-types')
const makeErrorHandler = require('./error-handler')

const errorHandler = makeErrorHandler({ DbConflictError, DbInvalidError, DbApplicationError })

module.exports = errorHandler
