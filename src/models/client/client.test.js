const makeClient = require('./index')
const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('../errors')
const getMockClient = require('./fixture')
const { ValueError } = require('../../common/custom-error-types')

describe('makeClient', () => {
  describe('param edge cases', () => {
    it('should not throw if object is valid', () => {
      expect(() => makeClient(getMockClient())).not.toThrow()
    })

    it('should not throw if empty param', () => {
      expect(() => makeClient()).not.toThrow()
    })

    it('should return an error if empty param', () => {
      const { error } = makeClient()
      expect(error).toBeInstanceOf(ValueError)
    })

    it('should not return error if valid param', () => {
      const { error } = makeClient(getMockClient())
      expect(error).toBeNull()
    })
  })

  describe('returned client structure', () => {
    it('should return same structure of client on valid param', () => {
      const mock = getMockClient()
      const { data: actual } = makeClient(mock)
      const expected = mock
      expect(actual).toMatchObject(expected)
    })

    it('should return same structure on valid param and not omit id', () => {
      const mock = getMockClient()
      mock.id = 1
      const { data: actual } = makeClient(mock)
      const expected = mock
      expect(actual).toMatchObject(expected)
    })
  })

  for (const field of ['name', 'address']) {
    describe(`${field} field`, () => {
      it(`should return error if ${field} is missing`, () => {
        const mock = getMockClient()
        delete mock[field]
        const { error } = makeClient(mock)
        expect(error).toMatchObject(missingRequiredFieldError(field))
      })

      it(`should return error if ${field} is not a string`, () => {
        const mock = getMockClient()
        mock[field] = 1
        const { error } = makeClient(mock)
        expect(error).toMatchObject(invalidFieldError(field))
      })

      it(`should return error if ${field} length is 0`, () => {
        const mock = getMockClient()
        mock[field] = ''
        const { error } = makeClient(mock)
        expect(error).toMatchObject(emptyFieldError(field))
      })

      it(`should return error if ${field} is html tag`, () => {
        const mock = getMockClient()
        mock[field] = '<div></div>'
        const { error } = makeClient(mock)
        expect(error).toMatchObject(invalidFieldError(field))
      })

      it(`should escape html from ${field}`, () => {
        const validText = 'text'
        const mock = getMockClient()
        mock[field] = `<div>${validText}</div>`
        const { data: client } = makeClient(mock)
        expect(client[field]).toBe(validText)
      })

      it(`should escape script html tags from ${field}`, () => {
        const validText = 'text'
        const mock = getMockClient()
        mock[field] = `<script>alert('nasty security attack')</script>${validText}`
        const { data: client } = makeClient(mock)
        expect(client[field]).toBe(validText)
      })
    })
  }

  describe('sexId field', () => {
    it('should return error if missing', () => {
      const mock = getMockClient()
      delete mock.sexId
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('sexId'))
    })

    it('should return error if not a number', () => {
      const mock = getMockClient()
      mock.sexId = 'dummy'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('sexId'))
    })

    it('should return error if negative', () => {
      const mock = getMockClient()
      mock.sexId = -2
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('sexId'))
    })

    it('should return error if float', () => {
      const mock = getMockClient()
      mock.sexId = 2.1
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('sexId'))
    })
  })

  describe('isActive field', () => {
    it('should return error if missing', () => {
      const mock = getMockClient()
      delete mock.isActive
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('isActive'))
    })

    it('should return error if not a bool', () => {
      const mock = getMockClient()
      mock.isActive = 12
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('isActive'))
    })

    it('should return error if not parsable string to bool', () => {
      const mock = getMockClient()
      mock.isActive = 'text'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('isActive'))
    })

    it('should not return error if string parsable to bool', () => {
      const mock = getMockClient()
      mock.isActive = 'true'
      const { error } = makeClient(mock)
      expect(error).toBeNull()
    })

    it('should not return error if bool', () => {
      const mock = getMockClient()
      mock.isActive = false
      const { error } = makeClient(mock)
      expect(error).toBeNull()
    })
  })

  describe('email field', () => {
    it('should return error if email is missing', () => {
      const mock = getMockClient()
      delete mock.email
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('email'))
    })

    it('should return error if email is not a string', () => {
      const mock = getMockClient()
      mock.email = 1
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('email'))
    })

    it('should return error if email length is 0', () => {
      const mock = getMockClient()
      mock.email = ''
      const { error } = makeClient(mock)
      expect(error).toMatchObject(emptyFieldError('email'))
    })

    it('should return error if email string is is html tag', () => {
      const mock = getMockClient()
      mock.email = '<div></div>'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('email'))
    })

    it('should return error if email string is not an email', () => {
      const mock = getMockClient()
      mock.email = 'blah'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('email'))
    })

    it('should return error if email string is not an email', () => {
      const mock = getMockClient()
      mock.email = 'blah@com'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('email'))
    })

    it('should not return error if email is valid', () => {
      const mock = getMockClient()
      const { error } = makeClient(mock)
      expect(error).toBeNull()
    })
  })

  describe('birthDate field', () => {
    it('should return error if missing', () => {
      const mock = getMockClient()
      delete mock.birthDate
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('birthDate'))
    })

    it('should return error if not a string', () => {
      const mock = getMockClient()
      mock.birthDate = 1
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('birthDate'))
    })

    it('should return error if not a valid date', () => {
      const mock = getMockClient()
      mock.birthDate = '145'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('birthDate'))
    })

    it('should return error if not a valid date', () => {
      const mock = getMockClient()
      mock.birthDate = '1201-212-4'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('birthDate'))
    })
  })

  describe('id field (if exists)', () => {
    it('should return an error if id is not a number', () => {
      const mock = getMockClient()
      mock.id = '1201-212-4'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if negative numbrer', () => {
      const mock = getMockClient()
      mock.id = -3
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if float', () => {
      const mock = getMockClient()
      mock.id = 1.4
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('id'))
    })
  })
})
