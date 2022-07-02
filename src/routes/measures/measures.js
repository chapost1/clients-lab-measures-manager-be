const measures = require('express').Router()

module.exports = function makeMeasuresRouter ({ makeCallback, postMeasure, deleteMeasureById, getMeasureById, getMeasuresList }) {
  measures.post('', makeCallback(postMeasure))
  measures.get('', makeCallback(getMeasuresList))
  measures.get('/:id(\\d+)', makeCallback(getMeasureById))
  measures.delete('/:id(\\d+)', makeCallback(deleteMeasureById))
  return measures
}
