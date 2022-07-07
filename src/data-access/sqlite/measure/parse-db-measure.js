module.exports = function parseDbMeasure (source = {}) {
  const measure = {}
  if (source.id) {
    measure.id = source.id
  }
  if (source.name) {
    measure.name = source.name
  }
  if (source.category_name) {
    measure.categoryName = source.category_name
  }
  if (source.value_type_name) {
    measure.valueTypeName = source.value_type_name
  }
  return measure
}
