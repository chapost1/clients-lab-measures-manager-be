const { addMeasure, deleteMeasure, getMeasure, listMeasures } = require('../../use-cases/measure/index')

const makeAddMeasure = require('./add-measure')
const makeDeleteMeasure = require('./delete-measure')
const makeGetMeasure = require('./get-measure')
const makeGetMeasuresList = require('./list-measures')

const postMeasure = makeAddMeasure({ addMeasure })
const deleteMeasureById = makeDeleteMeasure({ deleteMeasure })
const getMeasureById = makeGetMeasure({ getMeasure })
const getMeasuresList = makeGetMeasuresList({ listMeasures })

const measuresController = Object.freeze({
  postMeasure,
  deleteMeasureById,
  getMeasureById,
  getMeasuresList
})

module.exports = measuresController
