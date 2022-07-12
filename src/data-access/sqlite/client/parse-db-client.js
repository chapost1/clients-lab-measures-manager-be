module.exports = function parseDbMeasure (source = {}) {
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
    client.email = source.email
  }
  if (source.phone_number) {
    client.contact = client.contact || {}
    client.phoneNumber = source.phone_number
  }
  if (source.address) {
    client.contact = client.contact || {}
    client.address = source.address
  }
  return client
}
