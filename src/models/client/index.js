const buildMakeClient = require('./client')
const htmlSanitizer = require('../html-sanitizer')
const {
  validatePositiveInteger,
  makeValidateStringInput,
  validateBoolean,
  validateDate,
  validateEmail,
  validateMobilePhone
} = require('../validators/index')
const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

const makeClient = buildMakeClient({ validatePositiveInteger, validateStringInput, validateBoolean, validateDate, validateEmail, validateMobilePhone })

module.exports = makeClient
