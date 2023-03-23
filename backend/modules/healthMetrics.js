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
                res.json(result.rows);
            }
        );
    }catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function createMetrics(req, res) {
    try {
        const { height, weight } = req.body;
        db.pool.connect(
            async function(err, client, done){
                const result = await client.query('INSERT INTO metrics (height, weight) VALUES ($1, $2) RETURNING id', [height, weight]);
                const id = result.rows[0].id;
                res.status(201).json({ id, height, weight });
            }
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}