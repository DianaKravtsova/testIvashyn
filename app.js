'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

app.use('/image', express.static(path.join(__dirname, 'image')));

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/user', userRouter);
app.use(authRouter);

const startApp = async (app) => {
  await db.getSequelize().sync({force: false, alter: true});
  console.log('models synced');
  
  app.listen(3003);
  console.log('Server started on port 3003');
 }
 
 startApp(app);