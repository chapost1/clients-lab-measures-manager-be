const buildMakeMeasure = require('./measure')
const { validatePositiveInteger, validateStringInput } = require('../validators/index')

const makeMeasure = buildMakeMeasure({ validatePositiveInteger, validateStringInput })

module.exports = makeMeasure
