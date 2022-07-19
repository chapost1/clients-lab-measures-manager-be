const buildMakeMeasureCategory = require('./measure-category')
const { validatePositiveInteger, validateStringInput } = require('../validators/index')

const makeMeasureCategory = buildMakeMeasureCategory({ validatePositiveInteger, validateStringInput })

module.exports = makeMeasureCategory
