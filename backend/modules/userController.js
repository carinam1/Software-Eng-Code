const db = require('../database');
const jwt = require("jsonwebtoken")
const key = "PrivateKey1234"

module.exports = {
    createUser,
    getUser,loginValidate,loginVerify
}

// Login Function
async function loginValidate(req, res) {
    try {
        db.pool.connect(
            async function(err, client, done) {
                const result = await client.query("SELECT * FROM users WHERE email like '"+req.body.email +"' and password='" + req.body.password + "'");
                if (result){
                const payload = {
                    id: result.rows[0].id, email: result.rows[0].email}
                // Token generation
                const token = jwt.sign(payload,key,{expiresIn: "120min"});
                // SELECT * from users where 
                // const result = await client.query('SELECT * FROM users');
                res.json({token:token, Status:200});
            }
                else{
                    res.json({Status:403, message:'Please enter a valid username and password' });
                }
            }
        );
    }catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

// Login Verification
async function loginVerify(req, res) {
    try {
        db.pool.connect(
            async function(err, client, done) {
               
const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
                const bearer = bearerHeader.split(" ");
                const bearerToken = bearer[1];
                req.token = bearerToken;
                try {
                    const data = jwt.verify(req.token, key);
                 res.json({Success:data})
                } catch {
                    return res
                    .status(401)
                    .json({ Status: 401, Message: "Session expired! Please login" });
                        }
     } else {
                res
               .status(401)
                .json({ Status: 401, Message: "Not authorized! Please login" });
            }
                // SELECT * from users where 
                // const result = await client.query('SELECT * FROM users');
            }
        );
    }catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
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
        const { name, email, password } = req.body;
        db.pool.connect(
            async function(err, client, done){
                const userRecs = await client.query('SELECT * FROM users where email like $1', [email]);
                if(userRecs.rows.length > 0) {
                    res.status(403).json({ message: 'Email already exist, please try with another email' });    
                    return;
                }
                const result = await client.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id', [name, email, password]);
                const id = result.rows[0].id;
                res.status(200).json({ id, name, email, message:"User registered successfully",Status: 200 });
            }
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

