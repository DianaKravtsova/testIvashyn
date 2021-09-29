const express = require('express');
const positionController = require('../controllers/userController');
const positionRouter = express.Router();
const multer = require('multer');

positionRouter.post('/', positionController.addUser);
positionRouter.delete('/', positionController.deleteUser);
positionRouter.get('/', positionController.getAllUsers);
positionRouter.post('/pdf', positionController.addPdf);
positionRouter.put('/', positionController.updateUser);
positionRouter.post('/loadpicture', multer().any(), positionController.loadPicture);



module.exports = positionRouter;