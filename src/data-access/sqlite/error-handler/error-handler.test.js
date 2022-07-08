const { SqliteError } = require('better-sqlite3')
const { DbApplicationError, DbConflictError, DbInvalidError } = require('../../../common/custom-error-types')
const makeErrorHandler = require('./error-handler')

describe('errorHandler', () => {
  const errorHandler = makeErrorHandler({ DbConflictError, DbInvalidError, DbApplicationError })

  describe('err code: UNKNOWN', () => {
    it('should not throw error if got no error', () => {
      expect(errorHandler).not.toThrow()
    })

    it('should return null if got no error', () => {
      expect(errorHandler()).toBeNull()
    })

    it('should return DbApplicationError(invalid error (not SqliteError)) if has error with no message', () => {
      const result = errorHandler({})
      expect(result).toBeInstanceOf(DbApplicationError)
      expect(result.message).toBe('invalid error (not SqliteError)')
    })

    it('should not throw error if got unexpected error code', () => {
      expect(errorHandler.bind(null, new SqliteError('some dummy message', ''))).not.toThrow()
    })

    it('should return DbApplicationError if got unexpected error code', () => {
      expect(errorHandler(new SqliteError('some dummy message', ''))).toBeInstanceOf(DbApplicationError)
    })

    it('should return error.message, same as recieved', () => {
      const message = 'some dummy message'
      expect(errorHandler(new SqliteError('some dummy message', '')).message).toBe(message)
    })
  })

  describe('err code: SQLITE_CONSTRAINT_UNIQUE', () => {
    it('should return DbConflictError', () => {
      const message = 'UNIQUE constraint failed: measures_categories.name'
      const code = 'SQLITE_CONSTRAINT_UNIQUE'
      expect(errorHandler(new SqliteError(message, code))).toBeInstanceOf(DbConflictError)
    })

    it('should return DbApplicationError with no fields', () => {
      const message = 'UNIQUE constraint failed: '
      const code = 'SQLITE_CONSTRAINT_UNIQUE'
      expect(errorHandler(new SqliteError(message, code))).toBeInstanceOf(DbApplicationError)
    })

    it('should return expected message with one field', () => {
      const message = 'UNIQUE constraint failed: measures_categories.name'
      const code = 'SQLITE_CONSTRAINT_UNIQUE'
      expect(errorHandler(new SqliteError(message, code)).message).toBe('name should be unique, and already exist')
    })

    it('should return expected message with more than one field', () => {
      const message = 'UNIQUE constraint failed: measures_categories.name, measures_categories.email'
      const code = 'SQLITE_CONSTRAINT_UNIQUE'
      expect(errorHandler(new SqliteError(message, code)).message).toBe('(name, email) combination should be unique, and already exist')
    })
  })

  describe('err code: SQLITE_CONSTRAINT_NOTNULL', () => {
    it('should return DbInvalidError', () => {
      const message = 'NOT NULL constraint failed: measures_categories.name'
      const code = 'SQLITE_CONSTRAINT_NOTNULL'
      expect(errorHandler(new SqliteError(message, code))).toBeInstanceOf(DbInvalidError)
    })

    it('should return DbApplicationError with no fields', () => {
      const message = 'NOT NULL constraint failed: '
      const code = 'SQLITE_CONSTRAINT_NOTNULL'
      expect(errorHandler(new SqliteError(message, code))).toBeInstanceOf(DbApplicationError)
    })

    it('should return expected message with one field', () => {
      const message = 'NOT NULL constraint failed: measures_categories.name'
      const code = 'SQLITE_CONSTRAINT_NOTNULL'
      expect(errorHandler(new SqliteError(message, code)).message).toBe('name should not be null')
    })

    it('should return expected message with more than one field', () => {
      const message = 'NOT NULL constraint failed: measures_categories.name, measures_categories.email'
      const code = 'SQLITE_CONSTRAINT_NOTNULL'
      expect(errorHandler(new SqliteError(message, code)).message).toBe('(name, email) should not be null')
    })
  })
})
