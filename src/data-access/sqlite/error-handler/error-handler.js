function makeSqliteUserErrorsFormatter ({ DbApplicationError, DbConflictError, DbInvalidError }) {
  return Object.freeze({
    dbErrorMessagesHandlers: {
      SQLITE_CONSTRAINT_NOTNULL: {
        format: function (message) {
          const fieldsList = message.split(':').pop().trim().split(', ').map(fieldWithTableName => fieldWithTableName.split('.').pop())
          if (fieldsList.length > 1) {
            return `(${fieldsList.join(', ')}) should not be null`
          } else {
            const fieldName = fieldsList[0].trim()
            if (fieldName.length < 1) {
              throw Error('invalid notnull constrait error message')
            }
            return `${fieldsList[0]} should not be null`
          }
        },
        DB_ERROR_TYPE: DbInvalidError
      },
      SQLITE_CONSTRAINT_UNIQUE: {
        format: function (message) {
          const fieldsList = message.split(':').pop().trim().split(', ').map(fieldWithTableName => fieldWithTableName.split('.').pop())
          if (fieldsList.length > 1) {
            return `(${fieldsList.join(', ')}) combination should be unique, and already exist`
          } else {
            const fieldName = fieldsList[0].trim()
            if (fieldName.length < 1) {
              throw Error('invalid unique constrait error message')
            }
            return `${fieldsList[0]} should be unique, and already exist`
          }
        },
        DB_ERROR_TYPE: DbConflictError
      }
    },

    isFormattable (code) {
      return code in this.dbErrorMessagesHandlers
    },

    getDbErrorType (error) {
      if (!this.isFormattable(error.code)) {
        return message => new DbApplicationError(message)
      }
      return this.dbErrorMessagesHandlers[error.code].DB_ERROR_TYPE
    },

    format (error) {
      if (!this.isFormattable(error.code)) {
        return error.message
      }

      return this.dbErrorMessagesHandlers[error.code].format(error.message)
    },

    getDbError (error) {
      if (!this.isFormattable(error.code)) {
        return new DbApplicationError(error.message)
      }
      let formattedError = null
      try {
        formattedError = this.format(error)
      } catch (e) {
        return new DbApplicationError(`failed to format sqlite error, with code: ${error.code}, and message: ${error.message}`)
      }
      return new (this.getDbErrorType(error))(formattedError)
    }
  })
}

module.exports = function makeErrorHandler ({ DbConflictError, DbInvalidError, DbApplicationError }) {
  const sqliteUserErrorsFormatter = makeSqliteUserErrorsFormatter({ DbConflictError, DbInvalidError, DbApplicationError })
  return function errorHandler (error) {
    if (!error) {
      return null
    }

    if (!(error.message && error.code)) {
      return new DbApplicationError('invalid error (not having the structure of a proper SqliteError)')
    }

    return sqliteUserErrorsFormatter.getDbError(error)
  }
}
