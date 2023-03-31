const express = require('express');
const app = express();
const { Client } = require('pg');
const database = require('./database');
const userController = require('./modules/userController');
const bodyParser = require('body-parser');
const paymentMethod = require('./modules/paymentMethod');
const { userAccess } = require('./helper/verifyToken');
const cors = require("cors")

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors());

database.pool.connect()
  .then(() => {
    console.log('Connected to database');
    return database.pool.query(database.dbSetupQuery);
  })
  .then(() => {
    console.log('Database setup succesfully.');
  })
  .catch(err => {
    console.error('Error setting up database:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', function(req, res){
  userController.loginValidate(req, res);
});

app.post('/login_verify', userAccess);

app.get('/users', userAccess, function(req, res){
    userController.getUser(req, res);
});

app.post('/users', function(req, res){
    userController.createUser(req, res);
});

app.get('/payment', function(req, res){
  paymentMethod.getPayment(req, res);
});

app.post('/payment', function(req, res){
  paymentMethod.createPayment(req, res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
