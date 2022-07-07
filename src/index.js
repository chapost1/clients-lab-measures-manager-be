const express = require('express')
const bodyParser = require('body-parser')
const { expressCallback, bodyParserErrorHandler, customErrorHandler } = require('./express-utils/index')
const notFound = require('./controllers/not-found')
const routes = require('./routes/index')
const terminate = require('./terminate/index')
const { closeDataAccessConnections } = require('./data-access/index')
const async = require('async')

const app = express()

app.use(bodyParser.json())
app.use(bodyParserErrorHandler)

const apiRoot = '/api/v1'
app.use(apiRoot, routes)

app.use(expressCallback(notFound))

app.use(customErrorHandler)

const server = app.listen(Number(process.env.PORT), err => {
  if (err) {
    console.log('server initialization has been failed')
    throw err
  }
  console.log(`server is listening on port ${process.env.PORT}`)
})

server.on('close', () => {
  console.log('server has been closed successfully')
})

process.on('uncaughtException', error => {
  console.log('uncaughtException')
  async.series([
    closeDataAccessConnections
  ], () => terminate(server, error))
})

process.on('SIGHUP', () => closeDataAccessConnections(() => process.exit(0)))
  .on('SIGINT', () => closeDataAccessConnections(() => process.exit(0)))
  .on('SIGTERM', () => closeDataAccessConnections(() => process.exit(0)))

module.exports = app
