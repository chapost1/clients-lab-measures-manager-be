const unionModel = require('./union-model')

describe('unionModel', () => {
  it('should not crash on non params', () => {
    expect(() => unionModel()).not.toThrow()
  })

  it('should not crash on non object field - currentState', () => {
    expect(() => unionModel({ newState: {}, idOverwrite: 1 })).not.toThrow()
  })

  it('should not crash on non object field - newState', () => {
    expect(() => unionModel({ currentState: {}, idOverwrite: 1 })).not.toThrow()
  })

  it('should not crash on non id', () => {
    expect(() => unionModel({ currentState: {}, newState: {} })).not.toThrow()
  })

  it('should has all fields of params', () => {
    expect(unionModel({ currentState: { one: 1 }, newState: { second: 2 } })).toMatchObject({
      one: 1,
      second: 2
    })
  })

  it('should use new to overwrite', () => {
    expect(unionModel({ currentState: { one: 1 }, newState: { one: 2 } })).toMatchObject({
      one: 2
    })
  })

  it('should use id to overwrite', () => {
    expect(unionModel({ currentState: { one: 1 }, newState: { second: 2, id: 1 }, idOverwrite: 2 })).toMatchObject({
      one: 1,
      second: 2,
      id: 2
    })
  })
})
