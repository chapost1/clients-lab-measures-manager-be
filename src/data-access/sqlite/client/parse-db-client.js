module.exports = function parseDbClient (source = {}) {
  const client = {}
  if (source.id) {
    client.id = source.id
  }
  if (source.name) {
    client.name = source.name
  }
  if (source.birth_date) {
    client.birthDate = source.birth_date
  }
  if (typeof source.is_active === 'boolean') {
    client.isActive = source.is_active
  } else if (source.is_active === 0 || source.is_active === 1) {
    client.isActive = Boolean(source.is_active)
  }
  if (source.sex_name) {
    client.sex = client.sex || {}
    client.sex.name = source.sex_name
  }
  if (source.sex_id) {
    client.sex = client.sex || {}
    client.sex.id = source.sex_id
  }
  if (source.email) {
    client.contact = client.contact || {}
    client.contact.email = source.email
  }
  if (source.phone_number) {
    client.contact = client.contact || {}
    client.contact.phoneNumber = source.phone_number
  }
  if (source.address) {
    client.contact = client.contact || {}
    client.contact.address = source.address
  }
  return client
}
