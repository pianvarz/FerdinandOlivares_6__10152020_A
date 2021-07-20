const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //mongoose username: pianvarz; password: 4Dn97Azbh4PMQcYW
                                      //mongoose username: nandoOlivares; password: 5y2GBCFsjjC9xVvM
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://pianvarz:4Dn97Azbh4PMQcYW@cluster0.ikkfy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

mongoose.connect('mongodb+srv://nandoOlivares:5y2GBCFsjjC9xVvM@cluster0.ikkfy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
    });

app.use(bodyParser.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

//Created accounts - Username: Nando@mail.com; Password: Password12
                            // Ferdinand@mail.com        Ferdinand247
                            // olivares@mail.com         Olivares24