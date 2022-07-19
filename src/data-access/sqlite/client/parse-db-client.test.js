const parseDbClient = require('./parse-db-client')

describe('parseDbClient', () => {
  it('should return empty object when recieve nothing', () => {
    const output = parseDbClient()
    expect(output).toMatchObject({})
  })

  it('should return same name', () => {
    const name = 'name'
    const output = parseDbClient({ name })
    expect(output.name).toBe(name)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return same id', () => {
    const id = 'id'
    const output = parseDbClient({ id })
    expect(output.id).toBe(id)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return same birth_date', () => {
    const birthDate = 'birth_date'
    const output = parseDbClient({ birth_date: birthDate })
    expect(output.birthDate).toBe(birthDate)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return is active as int (1) to be bool', () => {
    const isActive = 1
    const output = parseDbClient({ is_active: isActive })
    expect(output.isActive).toBe(true)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return is active as int (0) to be bool', () => {
    const isActive = 0
    const output = parseDbClient({ is_active: isActive })
    expect(output.isActive).toBe(false)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return is active as bool(F) to be bool', () => {
    const isActive = false
    const output = parseDbClient({ is_active: isActive })
    expect(output.isActive).toBe(false)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return is active as bool(T) to be bool', () => {
    const isActive = true
    const output = parseDbClient({ is_active: isActive })
    expect(output.isActive).toBe(true)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return same sex name (different field)', () => {
    const sexName = 'sex_name'
    const output = parseDbClient({ sex_name: sexName })
    expect(output.sex.name).toBe(sexName)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return same sex id (different field)', () => {
    const sexId = 'sex_id'
    const output = parseDbClient({ sex_id: sexId })
    expect(output.sex.id).toBe(sexId)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return same phone_number (different field)', () => {
    const phoneNumber = 'phone_number'
    const output = parseDbClient({ phone_number: phoneNumber })
    expect(output.contact.phoneNumber).toBe(phoneNumber)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return same email (different field)', () => {
    const email = 'email'
    const output = parseDbClient({ email })
    expect(output.contact.email).toBe(email)
    expect(Object.keys(output).length).toBe(1)
  })

  it('should return same address (different field)', () => {
    const address = 'address'
    const output = parseDbClient({ address })
    expect(output.contact.address).toBe(address)
    expect(Object.keys(output).length).toBe(1)
  })
})
