const sanitizeHtml = require('sanitize-html')

const htmlSanitizer = (text) => {
  return sanitizeHtml(text, {
    allowedTags: []
  }).trim()
}

module.exports = {
  htmlSanitizer
}
