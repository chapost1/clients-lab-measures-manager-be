module.exports = function makeTerminate ({ dumpError }) {
  return function terminate (server, error) {
    console.log(`terminating, error: ${dumpError(error)}`)
    // todo: log in to permanent storage

    // attempt a gracefully shutdown
    server.close(() => {
      process.exit(1) // then exit
    })

    // If a graceful shutdown is not achieved after 1 second,
    // shut down the process completely
    setTimeout(() => {
      process.abort() // exit immediately and generate a core dump file
    }, 1000).unref()
  }
}
