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
      delete expected.sex.name// no name relation types names in constructors
      expect(actual).toMatchObject(expected)
    })

    it('should return same structure on valid param and not omit id', () => {
      const mock = getMockClient()
      mock.id = 1
      const { data: actual } = makeClient(mock)
      const expected = mock
      delete expected.sex.name// no name relation types names in constructors
      expect(actual).toMatchObject(expected)
    })
  })

  for (const fieldConf of [
    { field: 'name', validText: 'text', parentField: null },
    { field: 'address', validText: 'text', parentField: 'contact' },
    { field: 'phoneNumber', validText: getMockClient().contact.phoneNumber, parentField: 'contact' },
    { field: 'email', validText: getMockClient().contact.email, parentField: 'contact' }
  ]) {
    const field = fieldConf.field
    const parentField = fieldConf.parentField
    const fieldErrorIdentifier = parentField ? `${parentField}.${field}` : field
    describe(`${field} field`, () => {
      if (parentField) {
        it(`should return error if ${parentField} is missing`, () => {
          const mock = getMockClient()
          delete mock[parentField]
          const { error } = makeClient(mock)
          expect(error).toMatchObject(missingRequiredFieldError(parentField))
        })
      }

      const getParentFieldOfCandidate = (client) => {
        if (parentField) {
          return client[parentField]
        } else {
          return client
        }
      }

      it(`should return error if ${fieldErrorIdentifier} is missing`, () => {
        const mock = getMockClient()
        delete getParentFieldOfCandidate(mock)[field]
        const { error } = makeClient(mock)
        expect(error).toMatchObject(missingRequiredFieldError(fieldErrorIdentifier))
      })

      it(`should return error if ${fieldErrorIdentifier} is not a string`, () => {
        const mock = getMockClient()
        getParentFieldOfCandidate(mock)[field] = 1
        const { error } = makeClient(mock)
        expect(error).toMatchObject(invalidFieldError(fieldErrorIdentifier))
      })

      it(`should return error if ${fieldErrorIdentifier} length is 0`, () => {
        const mock = getMockClient()
        getParentFieldOfCandidate(mock)[field] = ''
        const { error } = makeClient(mock)
        expect(error).toMatchObject(emptyFieldError(fieldErrorIdentifier))
      })

      it(`should return error if ${fieldErrorIdentifier} is html tag`, () => {
        const mock = getMockClient()
        getParentFieldOfCandidate(mock)[field] = '<div></div>'
        const { error } = makeClient(mock)
        expect(error).toMatchObject(invalidFieldError(fieldErrorIdentifier))
      })

      it(`should escape html from ${fieldErrorIdentifier}`, () => {
        const validText = fieldConf.validText
        const mock = getMockClient()
        getParentFieldOfCandidate(mock)[field] = `<div>${validText}</div>`
        const { data: client } = makeClient(mock)
        expect(getParentFieldOfCandidate(client)[field]).toBe(validText)
      })

      it(`should escape script html tags from ${fieldErrorIdentifier}`, () => {
        const validText = fieldConf.validText
        const mock = getMockClient()
        getParentFieldOfCandidate(mock)[field] =
         `<script>alert('nasty security attack')</script>${validText}`
        const { data: client } = makeClient(mock)
        expect(getParentFieldOfCandidate(client)[field]).toBe(validText)
      })
    })
  }

  describe('sex.id field', () => {
    it('should return error if sex field is missing', () => {
      const mock = getMockClient()
      delete mock.sex
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('sex'))
    })

    it('should return error if sex.id is missing', () => {
      const mock = getMockClient()
      delete mock.sex.id
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('sex.id'))
    })

    it('should return error if not a number', () => {
      const mock = getMockClient()
      mock.sex.id = 'dummy'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('sex.id'))
    })

    it('should return error if negative', () => {
      const mock = getMockClient()
      mock.sex.id = -2
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('sex.id'))
    })

    it('should return error if float', () => {
      const mock = getMockClient()
      mock.sex.id = 2.1
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('sex.id'))
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

  describe('contact.email field', () => {
    it('should return error if contact.email is missing', () => {
      const mock = getMockClient()
      delete mock.contact.email
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('contact.email'))
    })

    it('should return error if email is not a string', () => {
      const mock = getMockClient()
      mock.contact.email = 1
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('contact.email'))
    })

    it('should return error if email length is 0', () => {
      const mock = getMockClient()
      mock.contact.email = ''
      const { error } = makeClient(mock)
      expect(error).toMatchObject(emptyFieldError('contact.email'))
    })

    it('should return error if email string is is html tag', () => {
      const mock = getMockClient()
      mock.contact.email = '<div></div>'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('contact.email'))
    })

    it('should return error if email string is not an email', () => {
      const mock = getMockClient()
      mock.contact.email = 'blah'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('contact.email'))
    })

    it('should return error if email string is not an email', () => {
      const mock = getMockClient()
      mock.contact.email = 'blah@com'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('contact.email'))
    })

    it('should not return error if email is valid', () => {
      const mock = getMockClient()
      const { error } = makeClient(mock)
      expect(error).toBeNull()
    })
  })

  describe('contact.phoneNumber field', () => {
    it('should return phoneNumber if email is missing', () => {
      const mock = getMockClient()
      delete mock.contact.phoneNumber
      const { error } = makeClient(mock)
      expect(error).toMatchObject(missingRequiredFieldError('contact.phoneNumber'))
    })

    it('should return error if phoneNumber is not a string', () => {
      const mock = getMockClient()
      mock.contact.phoneNumber = 1
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('contact.phoneNumber'))
    })

    it('should return error if phoneNumber string is not a phoneNumber', () => {
      const mock = getMockClient()
      mock.contact.phoneNumber = 'blah'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('contact.phoneNumber'))
    })

    it('should return error if phoneNumber string is not a phoneNumber', () => {
      const mock = getMockClient()
      mock.contact.phoneNumber = '34353'
      const { error } = makeClient(mock)
      expect(error).toMatchObject(invalidFieldError('contact.phoneNumber'))
    })

    it('should not return error if phoneNumber is valid', () => {
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
