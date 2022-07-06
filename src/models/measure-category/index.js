const buildMakeMeasureCategory = require('./measure-category')
const { validatePositiveInteger, makeValidateStringInput } = require('../validators/index')
const htmlSanitizer = require('../html-sanitizer')
const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

const makeMeasureCategory = buildMakeMeasureCategory({ validatePositiveInteger, validateStringInput })

module.exports = makeMeasureCategory
