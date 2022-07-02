const UNEXPECTED_ERROR_MESSAGE = 'internal server error, please try again later'

module.exports = function makeExpressCallback (controller) {
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
      try {
        if (err) {
          // todo: log
          return res.status(500).send({ error: UNEXPECTED_ERROR_MESSAGE })
        }
        if (httpResponse.headers) {
          res.set(httpResponse.headers)
        }
        res.type('json')
        res.status(httpResponse.statusCode).send(httpResponse.body)
      } catch (e) {
        // will not catch internal callbacks exceptions tough
        res.status(500).send({ error: UNEXPECTED_ERROR_MESSAGE })
      }
    })
  }
}
