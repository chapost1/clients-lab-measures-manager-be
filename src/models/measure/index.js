const buildMakeMeasure = require('./measure')
const { validatePositiveInteger, makeValidateStringInput } = require('../validators/index')
const htmlSanitizer = require('../html-sanitizer')
const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

const makeMeasure = buildMakeMeasure({ validatePositiveInteger, validateStringInput })

module.exports = makeMeasure
