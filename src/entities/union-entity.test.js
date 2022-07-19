const unionEntity = require('./union-entity')

describe('unionEntity', () => {
  it('should not crash on non params', () => {
    expect(() => unionEntity()).not.toThrow()
  })

  it('should not crash on non object field - currentState', () => {
    expect(() => unionEntity({ newState: {}, idOverwrite: 1 })).not.toThrow()
  })

  it('should not crash on non object field - newState', () => {
    expect(() => unionEntity({ currentState: {}, idOverwrite: 1 })).not.toThrow()
  })

  it('should not crash on non id', () => {
    expect(() => unionEntity({ currentState: {}, newState: {} })).not.toThrow()
  })

  it('should has all fields of params', () => {
    expect(unionEntity({ currentState: { one: 1 }, newState: { second: 2 } })).toMatchObject({
      one: 1,
      second: 2
    })
  })

  it('should use new to overwrite', () => {
    expect(unionEntity({ currentState: { one: 1 }, newState: { one: 2 } })).toMatchObject({
      one: 2
    })
  })

  it('should use id to overwrite', () => {
    expect(unionEntity({ currentState: { one: 1 }, newState: { second: 2, id: 1 }, idOverwrite: 2 })).toMatchObject({
      one: 1,
      second: 2,
      id: 2
    })
  })
})
