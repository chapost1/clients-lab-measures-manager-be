const { ValueError, NotFoundError, ModelConstructionError, InvalidRationalValueError, DbConflictError, DbInvalidError } = require('../common/custom-error-types')

const statusCodeByUserErrorTypes = {
  [ValueError.name]: 400, // Bad Request
  [NotFoundError.name]: 404, // Not Found
  [DbConflictError.name]: 409, // Conflict
  [ModelConstructionError.name]: 422, // Uprocessable Entity
  [InvalidRationalValueError.name]: 422, // Uprocessable Entity
  [DbInvalidError.name]: 422 // Uprocessable Entity
}

const isUserErrorToExplicit = error => {
  if (error && error.name in statusCodeByUserErrorTypes) {
    return true
  }
  return false
}

const jsonResponse = ({ code, payload }) => {
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode: code,
    body: payload
  }
}

const errorResponseConstructor = error => {
  return jsonResponse({
    code: statusCodeByUserErrorTypes[error.name],
    payload: {
      error: error.message
    }
  })
}

const createdResponse = payload => {
  return jsonResponse({
    code: 201,
    payload
  })
}

const okResponse = payload => {
  return jsonResponse({
    code: 200,
    payload
  })
}

const operationSuccessResponse = () => {
  return jsonResponse({
    code: 204
  })
}

const notFoundResponse = () => {
  return jsonResponse({
    code: 404
  })
}

const errorHandler = (err, callback) => {
  if (isUserErrorToExplicit(err)) {
    return callback(null, errorResponseConstructor(err))
  }
  // error is unexpected and therefore, internal error
  return callback(err)
}

module.exports = Object.freeze({
  createdResponse,
  okResponse,
  notFoundResponse,
  operationSuccessResponse,
  errorHandler
})
