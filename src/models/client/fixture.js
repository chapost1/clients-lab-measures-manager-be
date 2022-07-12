module.exports = function getMockClient () {
  return {
    id: null,
    name: 'Roy Sabah',
    birthDate: '2011-08-04',
    isActive: true,
    sex: {
      id: 1,
      name: 'F'
    },
    contact: {
      email: 'foo@bar.com',
      phoneNumber: '+972569123449',
      address: 'Modi\'in, Shmuel Hanavi 14'
    }
  }
}
