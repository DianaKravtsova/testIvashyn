const config = require('./../config');
const jwt = require('jsonwebtoken');

module.exports = generateToken = (id) => {
  return jwt.sign({id}, config.server.secret, {expiresIn: config.server.expiresIn});
}