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
                res.json(result.rows);
            }
        );
    }catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function createPayment(req, res) {
    try {
        const { ccnumber, cvv } = req.body;
        db.pool.connect(
            async function(err, client, done){
                const result = await client.query('INSERT INTO payment (ccnumber, cvv) VALUES ($1, $2) RETURNING id', [ccnumber, cvv]);
                const id = result.rows[0].id;
                res.status(201).json({ id, ccnumber, cvv });
            }
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}