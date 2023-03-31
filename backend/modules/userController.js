const db = require('../database');
//const http = require('http');

const createUser = async function(req, res) {
  try {
    const { name, email } = req.body;
    db.pool.connect(async function(err, client, done) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end();
        return;
      }
      const result = await client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email]);
      const id = result.rows[0].id;
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({ id, name, email }));
      res.end();
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

const getUser = async function(req, res) {
  try {
    db.pool.connect(async function(err, client, done) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end();
        return;
      }
      const result = await client.query('SELECT * FROM users');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(result.rows));
      res.end();
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

/*
const server = http.createServer(function(req, res) {
  if (req.method === 'GET' && req.url === '/users') {
    getUser(req, res);
  } else if (req.method === 'POST' && req.url === '/users') {
    let body = '';
    req.on('data', function(chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      req.body = JSON.parse(body);
      createUser(req, res);
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
  }
});

*/
module.exports = {
  createUser,
  getUser
};
