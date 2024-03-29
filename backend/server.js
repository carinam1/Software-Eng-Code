const database = require('./database');
const userController = require('./modules/userController');
const paymentMethod = require('./modules/paymentMethod');
const healthMetrics = require('./modules/healthMetrics');
const http = require('http');

// Middleware to parse JSON request bodies
function jsonBodyParser(req, res, next) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    req.body = JSON.parse(body);
    next();
  });
}

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

  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Hello World!');
      res.end();
    } else if (req.url === '/users' && req.method === 'GET') {
      userController.getUser(req, res);
    } else if (req.url === '/users' && req.method === 'POST') {
      jsonBodyParser(req, res, () => {
        userController.createUser(req, res);
      });
    } else if (req.url === '/payment' && req.method === 'GET') {
      paymentMethod.getPayment(req, res);
    } else if (req.url === '/payment' && req.method === 'POST') {
      jsonBodyParser(req, res, () => {
        paymentMethod.createPayment(req, res);
      });
    } else if (req.url === '/metrics' && req.method === 'GET') {
        healthMetrics.getMetrics(req, res);
    } else if (req.url === '/metrics' && req.method === 'POST') {
      jsonBodyParser(req, res, () => {
        healthMetrics.createMetrics(req, res);
      });
    } else if (req.url === '/login_verify' && req.method === 'POST'){
      jsonBodyParser(req, res, () => {
        userController.loginVerify(req, res);
      })
    } else if (req.url === '/login_validate' && req.method === 'POST'){
    jsonBodyParser(req, res, () => {
      userController.loginValidate(req, res);
    })
  }
  });

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});