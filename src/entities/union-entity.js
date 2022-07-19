const isObject = require('../common/is-object')

module.exports = function unionEntity ({ currentState, newState, idOverwrite = null } = {}) {
  let entity = {}

  if (isObject(currentState)) {
    entity = {
      ...entity,
      ...currentState
    }
  }

  if (isObject(newState)) {
    entity = {
      ...entity,
      ...newState
    }
  }

  if (idOverwrite) {
    entity = {
      ...entity,
      ...{ id: idOverwrite }
    }
  }

  return entity
}
