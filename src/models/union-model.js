module.exports = function unionModel ({ currentState, newState, idOverwrite = null } = {}) {
  const model = {
    ...currentState,
    ...newState
  }

  if (idOverwrite) {
    return { ...model, ...{ id: idOverwrite } }
  }

  return model
}
