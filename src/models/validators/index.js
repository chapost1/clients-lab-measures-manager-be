const { missingRequiredFieldError, invalidFieldError, emptyFieldError } = require('../errors')
const makeMakeValidateStringInput = require('./validate-string-input')
const makeValidatePositiveInteger = require('./validate-positive-integer')
const makeMakeValidateMobilePhone = require('./validate-mobile-phone')
const makeMakeValidateBoolean = require('./validate-boolean')
const makeMakeValidateDate = require('./validate-date')
const makeMakeValidateEmail = require('./validate-email')
const isBoolean = require('validator/lib/isBoolean')
const isEmail = require('validator/lib/isEmail')
const isDate = require('validator/lib/isDate')
const isMobilePhone = require('./is-mobile-phone')

const makeValidateBoolean = makeMakeValidateBoolean({ missingRequiredFieldError, invalidFieldError })
const makeValidateDate = makeMakeValidateDate({ missingRequiredFieldError, invalidFieldError })
const makeValidateEmail = makeMakeValidateEmail({ missingRequiredFieldError, invalidFieldError })
const validatePositiveInteger = makeValidatePositiveInteger({ invalidFieldError, missingRequiredFieldError })
const makeValidateStringInput = makeMakeValidateStringInput({ missingRequiredFieldError, invalidFieldError, emptyFieldError })
const makeValidateMobilePhone = makeMakeValidateMobilePhone({ missingRequiredFieldError, invalidFieldError, emptyFieldError })

const validateBoolean = makeValidateBoolean({ isBoolean })
const validateDate = makeValidateDate({ isDate })
const validateEmail = makeValidateEmail({ isEmail })
const validateMobilePhone = makeValidateMobilePhone({ isMobilePhone })

module.exports = Object.freeze({
  validateBoolean,
  validateDate,
  validateEmail,
  validatePositiveInteger,
  makeValidateStringInput,
  validateMobilePhone
})
