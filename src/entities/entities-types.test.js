const {
  CLIENT,
  MEASURE,
  SEX_TYPE,
  MEASURE_CATEGORY,
  MEASURE_VALUE_TYPE
} = require('./entities-types')

describe('validate entity types const values', () => {
  it('client', () => {
    expect(CLIENT).toBe('client')
  })

  it('measure', () => {
    expect(MEASURE).toBe('measure')
  })

  it('sex type', () => {
    expect(SEX_TYPE).toBe('sex type')
  })

  it('measure category', () => {
    expect(MEASURE_CATEGORY).toBe('measure category')
  })

  it('measure value type', () => {
    expect(MEASURE_VALUE_TYPE).toBe('measure value type')
  })
})
