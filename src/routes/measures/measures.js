const measures = require('express').Router()

module.exports = function makeMeasuresRouter ({ expressCallback, postMeasure, deleteMeasureById, getMeasureById, getMeasuresList }) {
  measures.post('', expressCallback(postMeasure))
  measures.get('', expressCallback(getMeasuresList))
  measures.get('/:id(\\d+)', expressCallback(getMeasureById))
  measures.delete('/:id(\\d+)', expressCallback(deleteMeasureById))
  return measures
}
