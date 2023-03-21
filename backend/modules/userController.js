const db = require('../database');

module.exports = {
    createUser,
    getUser
}

async function getUser(req, res) {
    try {
        db.pool.connect(
            async function(err, client, done) {
                const result = await client.query('SELECT * FROM users');
                res.json(result.rows);
            }
        );
    }catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function createUser(req, res) {
    try {
        const { name, email } = req.body;
        db.pool.connect(
            async function(err, client, done){
                const result = await client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email]);
                const id = result.rows[0].id;
                res.status(201).json({ id, name, email });
            }
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}
