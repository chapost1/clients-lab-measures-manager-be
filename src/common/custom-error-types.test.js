const {
  ModelConstructionError,
  ValueError,
  InvalidRationalValueError,
  NotFoundError,
  DbApplicationError,
  DbInvalidError,
  DbConflictError
} = require('./custom-error-types')

const validatators = [
  {
    instance: ModelConstructionError,
    expectedName: 'ModelConstructionError'
  },
  {
    instance: ValueError,
    expectedName: 'ValueError'
  },
  {
    instance: InvalidRationalValueError,
    expectedName: 'InvalidRationalValueError'
  },
  {
    instance: NotFoundError,
    expectedName: 'NotFoundError'
  },
  {
    instance: DbApplicationError,
    expectedName: 'DbApplicationError'
  },
  {
    instance: DbInvalidError,
    expectedName: 'DbInvalidError'
  },
  {
    instance: DbConflictError,
    expectedName: 'DbConflictError'
  }
]

for (const error of validatators) {
  describe(`Error Type: ${error.expectedName}`, () => {
    it('should match expected name', () => {
      expect(error.instance.name).toBe(error.expectedName)
    })
  })
}
