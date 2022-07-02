const express = require('express')
const bodyParser = require('body-parser')
const { makeCallback, bodyParserErrorHandler } = require('./express-utils/index')
const notFound = require('./controllers/not-found')
const routes = require('./routes/index')

process.on('uncaughtException', error => {
  // todo: log
  console.log(`uncaughtException: ${error}`)
  process.exit(1)
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParserErrorHandler)

const apiRoot = '/api/v1'
app.use(apiRoot, routes)

app.use(makeCallback(notFound))

app.listen(Number(process.env.PORT), err => {
  if (err) {
    console.log('server initialization has been failed')
    throw err
  }
  console.log(`server is listening on port ${process.env.PORT}`)
})

module.exports = app
