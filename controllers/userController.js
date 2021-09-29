const db = require('../db');
const AppError = require('../services/AppError');
const errorMessages = require('../services/errorMessages');
const {PDFDocument} = require('pdf-lib');    
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const models = db.getModels();
const path = require('path');

async function addUser (req, res){
  try {
    const { email, lastname, firstname, image, password } = req.body;
    if (!email ||
        !lastname || 
        !image || 
        !password) throw new AppError({status: 400, message: errorMessages.BAD_DATA});
    const existUser = await models.User.findOne({where: {email: email}});
    if (existUser) throw new AppError({status: 409, message: errorMessages.USER_EXISTS});
    await models.User.create({
      email: email,
      firstname: firstname,
      lastname: lastname,
      image: image,
      password: password
    });
    res.status(200).json(await models.User.findOne({where: {email: email}}));
  } catch (err) {
    res.status(err.status || 500).json(new AppError(err));
  }
}

async function updateUser (req, res) {
  try {
    if (!req.body.email || !req.body.firstname || !req.body.lastname) 
      throw new AppError({status: 400, messages: errorMessages.BAD_DATA});
    const { email, firstname, lastname } = req.body;
    await models.User.update({
      firstname, lastname
    }, {
      where: {email: email}
    });
    res.status(200).json(await models.User.findOne({ where: { email: email } }));
  } catch (err) {
    res.status(err.status || 500).json(new AppError(err));
  }
}

async function deleteUser (req, res){
  try {
    const { email, lastname, firstname, image, password } = req.body;
    const existUser = await models.User.findOne({where: {email: email}});
    if(!existUser) throw new AppError({status: 409, message: errorMessages.USER_NOT_FOUND});
    await models.User.destroy({ where: {email: email}});
    res.status(200).json(await models.User.findOne({where: {email: email}}));
  } catch (err) {
    res.status(err.status || 500).json(new AppError(err));
  }
}

async function getAllUsers (req, res){
  try {
    res.status(200).json(await models.User.findAll());
  } catch (err) {
    res.status(err.status || 500).json(new AppError(err));
  }
}

async function addPdf (req, res){
  try {
    if(!req.body.email) throw new AppError({status: 400, message: errorMessages.BAD_DATA});
    const { email } = req.body;
    const existUser = await models.User.findOne({where: {email: email}});
    if(!existUser) throw new AppError({status: 409, message: errorMessages.USER_NOT_FOUND});
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(existUser.firstname + ' ' + existUser.lastname);
    let imgBytes = '';
    existUser.image.includes(path.join(__dirname, '../image/')) 
      ? imgBytes = fs.readFileSync(existUser.image)
      : imgBytes = await fetch(existUser.image).then(res => res.arrayBuffer());
    let userImg = '';
    if (existUser.image.includes('.jpg'))
      userImg = await pdfDoc.embedJpg(imgBytes);
    if (existUser.image.includes('.png'))
      userImg = await pdfDoc.embedPng(imgBytes);
    if (userImg === '') throw new AppError({ status: 400, messages: errorMessages.WRONG_PHOTO_FORMAT });
    page.drawImage(userImg, {
      x: 50,
      y: 250,
      width: 250,
      height: 150,
    });

    const pdfBytes = await pdfDoc.save();
    existUser.pdf = pdfBytes.toString();
    await existUser.save();
    if (!existUser.pdf) return res.status(400).json(false);
    fs.writeFileSync('./temp.pdf', pdfBytes);
    res.status(200).json(true);
  } catch (err) {
    res.status(err.status || 500).json(new AppError(err));
  }
}

async function loadPicture (req, res){
  try {
    const { email } = req.body;
    const file = req.files[0];
    if(!fs.existsSync(path.resolve(__dirname, `../image/`))) 
      fs.mkdirSync(path.resolve(__dirname, `../image/`));

    if(!file) throw new AppError({status: 400, message: errorMessages.BAD_DATA});

    const existedUser = await models.User.findOne({ where: {email:email} });
    if(!existedUser) throw new AppError({status: 409, message: errorMessages.USER_NOT_FOUND});    
    const destinationDirectory = path.resolve(__dirname, `../image/`);
    const destinationPath = path.join(destinationDirectory, file.originalname);
    await existedUser.update({ image: destinationPath });
    fs.writeFileSync(destinationPath, file.buffer);  
    await existedUser.save();
    res.status(200).json({file: file.originalname});
  } catch (err) {
    throw new AppError(err);
  }
}
module.exports = { addUser, deleteUser, getAllUsers, addPdf, updateUser, loadPicture }