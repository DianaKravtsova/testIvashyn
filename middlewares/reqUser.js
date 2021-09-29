const AppError = require('./../../services/AppError');
const errorMessages = require('./../../services/errorMessages');
const db = require('./../../db/db');

async function reqUser(req, res, next) {
  try {
    if (!req.user) throw new AppError({status: 401, message: errorMessages.USER_NOT_FOUND});
    const models = db.getModels();
    const existUser = await models.User.findOne({where: {id: req.user.id}});

    if (!existUser) throw new AppError({status: 401, message: errorMessages.USER_NOT_FOUND});
    req.user = existUser.toJSON();
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({status: 500, message: errorMessages.SERVER_ERROR, err: err});
  }
}

module.exports = async function (req, res, next) {
  try {
    await reqUser(req, res, next);
  } catch (err) {
    res.status(err.status || 500).json(err);
  }
};