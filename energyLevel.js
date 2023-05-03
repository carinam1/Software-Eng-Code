const db = require('../database');

module.exports = {
    createEnergy,
    getEnergy
}

async function getEnergy(req, res) {
    try {
        db.pool.connect(
            async function(err, client, done) {
                const result = await client.query('SELECT * FROM energy');
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(result.rows));
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

async function createEnergy(req, res) {
    try {
        const { low, medium, high } = req.body;
        db.pool.connect(
            async function(err, client, done){
                const result = await client.query('INSERT INTO energy (low, medium, high) VALUES ($1, $2, $3) RETURNING id', [low, medium, high]);
                const id = result.rows[0].id;
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({ id, medium, high }));
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