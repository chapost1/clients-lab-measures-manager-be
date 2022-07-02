const buildMakeMeasureCategory = require('./measure-category')
const { validatePositiveInteger, makeValidateStringInput } = require('../validators')
const { htmlSanitizer } = require('../utils')
const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

const makeMeasureCategory = buildMakeMeasureCategory({ validatePositiveInteger, validateStringInput })

module.exports = makeMeasureCategory
