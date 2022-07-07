function makeSqliteUserErrorsFormatter ({ DbApplicationError, DbConflictError, DbInvalidError }) {
  return Object.freeze({
    SQLITE_CONSTRAINT: {
      extractConstraint: message => {
        message = message.split(':')[1].trim()
        const constaint = message.split(' constraint')[0]
        return constaint
      },

      dbErrorMessagesHandlers: {
        'NOT NULL': {
          format: function (message) {
            const fieldsList = message.split(':').pop().trim().split(', ').map(fieldWithTableName => fieldWithTableName.split('.').pop())
            return `${fieldsList.join(', ')} should not be null`
          },
          DB_ERROR_TYPE: DbInvalidError
        },
        UNIQUE: {
          format: function (message) {
            const fieldsList = message.split(':').pop().trim().split(', ').map(fieldWithTableName => fieldWithTableName.split('.').pop())
            if (fieldsList.length > 1) {
              return `${fieldsList.join(', ')} combination should be unique, and already exist`
            } else { // 1
              return `${fieldsList[0]} should be unique, and already exist`
            }
          },
          DB_ERROR_TYPE: DbConflictError
        }
      },

      isFormattable (message) {
        return this.extractConstraint(message) in this.dbErrorMessagesHandlers
      },

      getDbErrorType (message) {
        if (!this.isFormattable(message)) {
          return message => new DbApplicationError(message)
        }
        return this.dbErrorMessagesHandlers[this.extractConstraint(message)].DB_ERROR_TYPE
      },

      format (message) {
        if (!this.isFormattable(message)) {
          return message
        }

        return this.dbErrorMessagesHandlers[this.extractConstraint(message)].format(message)
      },

      getDbError (message) {
        if (!this.isFormattable(message)) {
          return new DbApplicationError(message)
        }
        const formattedError = this.format(message)
        return new (this.getDbErrorType(message))(formattedError)
      }
    }
  })
}

module.exports = function makeErrorHandler ({ DbConflictError, DbInvalidError, DbApplicationError }) {
  const sqliteUserErrorsFormatter = makeSqliteUserErrorsFormatter({ DbConflictError, DbInvalidError, DbApplicationError })
  return function errorHandler (error) {
    if (!error) {
      return null
    }
    const isUserErrorType = Boolean(sqliteUserErrorsFormatter[error.code])
    if (isUserErrorType) {
      const formatter = sqliteUserErrorsFormatter[error.code]
      return formatter.getDbError(error.message)
    } else {
      return new DbApplicationError(error.message)
    }
  }
}
