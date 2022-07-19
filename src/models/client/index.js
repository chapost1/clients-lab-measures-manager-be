const buildMakeClient = require('./client')
const {
  validatePositiveInteger,
  validateStringInput,
  validateBoolean,
  validateDate,
  validateEmail,
  validateMobilePhone
} = require('../validators/index')

const makeClient = buildMakeClient({ validatePositiveInteger, validateStringInput, validateBoolean, validateDate, validateEmail, validateMobilePhone })

module.exports = makeClient
