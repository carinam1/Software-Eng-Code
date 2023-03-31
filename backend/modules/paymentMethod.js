const db = require('../database');

module.exports = {
    createPayment,
    getPayment
}

async function getPayment(req, res) {
    try {
        db.pool.connect(
            async function(err, client, done) {
                const result = await client.query('SELECT * FROM payment');
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(result.rows));
                res.end();
            }
        );
    }catch (err) {
        console.error(err);
        res.statusCode = 500; // set the status code
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error'); // send the response body\
    }
}

async function createPayment(req, res) {
    try {
        const { ccnumber, cvv } = req.body;
        db.pool.connect(
            async function(err, client, done){
                const result = await client.query('INSERT INTO payment (ccnumber, cvv) VALUES ($1, $2) RETURNING id', [ccnumber, cvv]);
                const id = result.rows[0].id;
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({ id, ccnumber, cvv }));
                res.end();
            }
        );
    } catch (err) {
        console.error(err);
        res.statusCode = 500; // set the status code
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error'); // send the response body\
    }
}