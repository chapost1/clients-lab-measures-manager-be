module.exports = function parseDbMeasure (source = {}) {
  const measure = {}
  if (source.id) {
    measure.id = source.id
  }
  if (source.name) {
    measure.name = source.name
  }
  if (source.category_name) {
    measure.category = measure.category || {}
    measure.category.name = source.category_name
  }
  if (source.category_id) {
    measure.category = measure.category || {}
    measure.category.id = source.category_id
  }
  if (source.value_type_name) {
    measure.valueType = measure.valueType || {}
    measure.valueType.name = source.value_type_name
  }
  if (source.value_type_id) {
    measure.valueType = measure.valueType || {}
    measure.valueType.id = source.value_type_id
  }
  return measure
}
