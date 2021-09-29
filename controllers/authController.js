
const db = require('../db');
const errorMessages = require('../services/errorMessages');
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');
const AppError = require('../services/AppError');
const models = db.getModels();

async function login (req, res) {
  try {
    if (!req.body.email || !req.body.password) throw new AppError({ status: 400, messages: errorMessages.BAD_DATA });
    const { email, password } = req.body;
    const existedUser = await models.User.findOne({ where: { email: email } });
    if (!existedUser) throw new AppError({ status: 404, messages: errorMessages.USER_NOT_FOUND });
    if( !bcrypt.compareSync(password, existedUser.password)) 
      throw new AppError({ status: 400, messages: errorMessages.WRONG_PASSWORD });
    existedUser.token = jwt(existedUser.id);
    return res.status(200).json(existedUser);
  } catch (err) {
    res.status(err.status || 500).json(new AppError(err));  
  }
}

module.exports = {
  login
}