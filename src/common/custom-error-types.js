class ModelConstructionError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'ModelConstructionError'
  }
}

class ValueError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'ValueError'
  }
}

class InvalidRationalValueError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'InvalidRationalValueError'
  }
}

class NotFoundError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'NotFoundError'
  }
}

class DbApplicationError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'DbApplicationError'
  }
}

class DbInvalidError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'DbInvalidError'
  }
}

class DbConflictError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = 'DbConflictError'
  }
}

module.exports = Object.freeze({
  ModelConstructionError,
  ValueError,
  InvalidRationalValueError,
  NotFoundError,
  DbApplicationError,
  DbInvalidError,
  DbConflictError
})
