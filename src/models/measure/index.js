const buildMakeMeasure = require('./measure')
const { validatePositiveInteger, makeValidateStringInput } = require('../validators')
const { htmlSanitizer } = require('../utils')
const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

const makeMeasure = buildMakeMeasure({ validatePositiveInteger, validateStringInput })

module.exports = makeMeasure
