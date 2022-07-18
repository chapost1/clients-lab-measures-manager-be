module.exports = function isObject (obj) {
  if (!obj) {
    return false
  }

  if (Array.isArray(obj)) {
    return false
  }

  return typeof obj === 'object'
}
