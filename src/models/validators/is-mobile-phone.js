const isMobilePhone = require('validator/lib/isMobilePhone')

const isMobilePhoneByAppLocale = phoneNumber => {
  if (process.env.APP_LOCALE) {
    return isMobilePhone.default(phoneNumber, [process.env.APP_LOCALE])
  }
  return isMobilePhone.default(phoneNumber)
}

module.exports = isMobilePhoneByAppLocale
