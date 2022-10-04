//Used for jsDbList simmetric crypt
const Crypto = require('crypto-js');
module.exports = {
    key: Crypto.enc.Hex.parse('0001020304050607'),
    iv: Crypto.enc.Hex.parse('08090a0b0c0d0e0f'),
    pwd: 'abs!sçlds28aqqq'
}