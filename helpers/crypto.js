const crypto = require('crypto')
const password = 'secret'
const algorithm = 'aes256'

module.exports = {
  encrypt (text) {
    if (!text) return ''
    const cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf-8', 'base64')
    crypted += cipher.final('base64')
    return crypted
  },

  decrypt (text) {
    if (!text) return ''
    const decipher = crypto.createDecipher(algorithm, password)
    let decrypted = decipher.update(text, 'base64', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
  }
}
