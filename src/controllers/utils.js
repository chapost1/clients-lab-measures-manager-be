const { MODEL_CONSTRUCTION_ERROR, VALUE_ERROR, INVALID_RATIONAL_VALUE_ERROR, NOT_FOUND_ERROR } = require('../use-cases/error-types')
const { USER_END_DB_ERROR_INVALID, USER_END_DB_ERROR_CONFLICT } = require('../data-access/error-types')

const statusCodeByUserErrorTypes = {
  [VALUE_ERROR]: 400, // Bad Request
  [NOT_FOUND_ERROR]: 404, // Not Found
  [USER_END_DB_ERROR_CONFLICT]: 409, // Conflict
  [MODEL_CONSTRUCTION_ERROR]: 422, // Uprocessable Entity
  [INVALID_RATIONAL_VALUE_ERROR]: 422, // Uprocessable Entity
  [USER_END_DB_ERROR_INVALID]: 422 // Uprocessable Entity
}

const isUserErrorToExplicit = error => {
  if (error && error.type in statusCodeByUserErrorTypes) {
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
    code: statusCodeByUserErrorTypes[error.type],
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
