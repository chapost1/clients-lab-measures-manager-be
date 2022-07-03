module.exports = function dumpError (err) {
  let str = ''
  if (typeof err === 'object') {
    if (err.message) {
      str += `\nMessage: ${err.message}`
    }
    if (err.stack) {
      str += '\nStacktrace:'
      str += '\n====================\n'
      str += err.stack
    }
    if (str.length === 0) {
      console.log(`UNKNOWN EXCEPTION: ${JSON.stringify(err)}`)
    }
  } else if (typeof err === 'string') {
    str = err
  } else {
    console.log('dumpError :: argument is not an object OR string')
  }
  return str
}
