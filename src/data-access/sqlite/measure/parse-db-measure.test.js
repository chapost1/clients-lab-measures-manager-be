const parseDbMeasure = require('./parse-db-measure')

describe('parseDbMeasure', () => {
  it('should return empty object when recieve nothing', () => {
    expect(parseDbMeasure()).toMatchObject({})
  })

  it('should return same name', () => {
    const name = 'name'
    expect(parseDbMeasure({ name }).name).toBe(name)
  })

  it('should return same id', () => {
    const id = 'id'
    expect(parseDbMeasure({ id }).id).toBe(id)
  })

  it('should return same category name (different field)', () => {
    const categoryName = 'category_name'
    expect(parseDbMeasure({ category_name: categoryName }).category.name).toBe(categoryName)
  })

  it('should return same value type name (different field)', () => {
    const valueTypeName = 'value_type_name'
    expect(parseDbMeasure({ value_type_name: valueTypeName }).valueType.name).toBe(valueTypeName)
  })

  describe('should not return any new field which has not been initially passed', () => {
    it('should not suddenly add name', () => {
      const parsed = parseDbMeasure({ category_name: 'some value', value_type_name: 'other', id: 1 })
      expect(parsed.name).toBeUndefined()
    })

    it('should not suddenly add id', () => {
      const parsed = parseDbMeasure({ category_name: 'some value', value_type_name: 'other', name: '1' })
      expect(parsed.id).toBeUndefined()
    })

    it('should not suddenly add category name', () => {
      const parsed = parseDbMeasure({ id: 2, value_type_name: 'other', name: '1' })
      expect(parsed.categoryName).toBeUndefined()
      expect(parsed.category_name).toBeUndefined()
    })

    it('should not suddenly add value type name', () => {
      const parsed = parseDbMeasure({ id: 2, category_name: 'other', name: '1' })
      expect(parsed.valueTypeName).toBeUndefined()
      expect(parsed.value_type_name).toBeUndefined()
    })
  })
})
