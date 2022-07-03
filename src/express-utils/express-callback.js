module.exports = function makeExpressCallback ({ UNEXPECTED_ERROR_MESSAGE }) {
  return function expressCallback (controller) {
    return (req, res) => {
      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
        method: req.method,
        path: req.path,
        headers: {
          'Content-Type': req.get('Content-Type'),
          Referer: req.get('referer'),
          'User-Agent': req.get('User-Agent')
        }
      }

      controller(httpRequest, (err, httpResponse) => {
        if (res.locals.handledByCustomErrorHandler) {
          // error has been handled by custom error handler.
          return
        }
        if (res.headersSent) { // headers has already been sent.
          console.log('ERROR: controller callback has been called twice (headers has already been sent)')
          console.log(JSON.stringify({
            error: err,
            httpRequest
          }))
          // todo: log in to permanent storage
          return
        }
        if (err) {
          // todo: log in to permanent storage
          return res.status(500).send({ error: UNEXPECTED_ERROR_MESSAGE })
        }
        if (httpResponse.headers) {
          res.set(httpResponse.headers)
        }
        res.type('json')
        res.status(httpResponse.statusCode).send(httpResponse.body)
      })
    }
  }
}
