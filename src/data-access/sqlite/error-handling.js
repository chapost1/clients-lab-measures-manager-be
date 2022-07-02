const { APPLICATION_DB_ERROR, USER_END_DB_ERROR_CONFLICT, USER_END_DB_ERROR_INVALID } = require('../error-types')

const sqliteUserErrorsFormatter = Object.freeze({
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
        DB_ERROR_TYPE: USER_END_DB_ERROR_INVALID
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
        DB_ERROR_TYPE: USER_END_DB_ERROR_CONFLICT
      }
    },

    isFormattable (message) {
      return this.extractConstraint(message) in this.dbErrorMessagesHandlers
    },

    getDbErrorType (message) {
      if (!this.isFormattable(message)) {
        return message
      }
      return this.dbErrorMessagesHandlers[this.extractConstraint(message)].DB_ERROR_TYPE
    },

    format (message) {
      if (!this.isFormattable(message)) {
        return message
      }

      return this.dbErrorMessagesHandlers[this.extractConstraint(message)].format(message)
    }
  }
})

function errorHandler (error) {
  if (!error) {
    return null
  }
  const isUserErrorType = Boolean(sqliteUserErrorsFormatter[error.code]) && sqliteUserErrorsFormatter[error.code].isFormattable(error.message)
  if (isUserErrorType) {
    const formatter = sqliteUserErrorsFormatter[error.code]
    return {
      message: formatter.format(error.message),
      type: formatter.getDbErrorType(error.message)
    }
  } else {
    return {
      message: error.message,
      type: APPLICATION_DB_ERROR
    }
  }
}

module.exports = errorHandler
