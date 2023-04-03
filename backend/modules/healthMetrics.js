const db = require('../database');

module.exports = {
    createMetrics,
    getMetrics
}

async function getMetrics(req, res) {
    try {
        db.pool.connect(
            async function(err, client, done) {
                const result = await client.query('SELECT * FROM metrics');
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

async function createMetrics(req, res) {
    try {
        const { height, weight } = req.body;
        db.pool.connect(
            async function(err, client, done){
                const result = await client.query('INSERT INTO metrics (height, weight) VALUES ($1, $2) RETURNING id', [height, weight]);
                const id = result.rows[0].id;
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({ id, height, weight }));
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