const isObject = require('../common/is-object')

module.exports = function unionModel ({ currentState, newState, idOverwrite = null } = {}) {
  let model = {}

  if (isObject(currentState)) {
    model = {
      ...model,
      ...currentState
    }
  }

  if (isObject(newState)) {
    model = {
      ...model,
      ...newState
    }
  }

  if (idOverwrite) {
    model = {
      ...model,
      ...{ id: idOverwrite }
    }
  }

  return model
}
