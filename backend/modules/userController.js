const db = require('../database');
const jwt = require("jsonwebtoken")
const key = "PrivateKey1234"

// Login Function
function loginValidate(req, res) {
    db.pool.connect(function (err, client, done) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.end();
            return;
        }
        client.query(
            "SELECT * FROM users WHERE email LIKE '" +
            req.body.email +
            "' AND password='" +
            req.body.password + "'",
            function (queryError, result) {
                done();
                if (queryError) {
                    console.error(queryError);
                    res.statusCode = 500; // set the status code
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Internal Server Error'); // send the response body
                    return;
                }
                if (result && result.rows.length > 0) {
                    const payload = {
                        id: result.rows[0].id,
                        email: result.rows[0].email,
                    };
                    // Token generation
                    const token = jwt.sign(payload, key, { expiresIn: "120min" });
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify(token));
                    res.end();
                } else {
                  res.statusCode = 403; // set the status code
                  res.setHeader('Content-Type', 'text/plain');
                  res.end('Unauthorized'); // send the response body
                }
            }
        );
    });
}
    
    // Login Verification
    async function loginVerify(req, res) 
    {
      try 
      {
          const bearerHeader = req.headers.authorization;
          console.log(bearerHeader)
          if (typeof(bearerHeader) !== "undefined") 
          {
            try {
              jwt.verify(bearerHeader, key);
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end();
            } catch {
              res.statusCode = 401; // set the status code
              res.setHeader('Content-Type', 'text/plain');
              res.end('Session expired! Please login'); // send the response body
            }
          } else {
            res.statusCode = 401; // set the status code
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not authorized! Please login'); // send the response bod
          }
      } catch (err) {
        console.error(err);
        res.statusCode = 500; // set the status code
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error'); // send the response body
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
            res.statusCode = 500; // set the status code
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error'); // send the response body\
          }
    }
    
    const createUser = async function(req, res) {
        try {
            const { name, email, password } = req.body;
            db.pool.connect(async function(err, client, done) {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end();
                return;
              }
              const userRecs = await client.query('SELECT * FROM users where email like $1', [email]);
              if(userRecs.rows.length > 0) {
                    res.statusCode = 403; // set the status code
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Email already exist, please try with another email'); // send the response body\
                    return;
              }
              const result = await client.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id', [name, email, password]);
              const id = result.rows[0].id;
              res.writeHead(201, {'Content-Type': 'application/json'});
              res.write(JSON.stringify({ id, name, email }));
              res.end();
            });
        } catch (err) {
            console.error(err);
            res.statusCode = 500; // set the status code
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error'); // send the response body\
        }
    }

    module.exports = {
        createUser, 
        getUser,
        loginValidate,
        loginVerify
    }
