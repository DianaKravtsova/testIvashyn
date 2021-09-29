const expressJwt = require('express-jwt');
const config = require('../../config.js');
const errorMessages = require('./../../services/errorMessages.js');

module.exports = expressJwt({
  secret: config.server.secret, algorithms: ['HS256'], fail: (req, res) => {
    if (!req.headers.authorization) res.send(401, errorMessages.MISSING_AUTHORIZATION_HEADER);
    res.send(401);
  }
});