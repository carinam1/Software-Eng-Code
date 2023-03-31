var pg = require('pg')
var config = {
    user: 'postgres', // name of the user account
    password: 'password',
    database: 'postgres', // name of the database
    host: 'localhost',
    port: '5432',
    max: 20, // max number of clients in the pool
    idleTimeoutMillis: 30000 
}

var pool = new pg.Pool(config);

const dbSetupQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    ccnumber TEXT NOT NULL,
    cvv TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    height TEXT NOT NULL,
    weight TEXT NOT NULL
  );
`;

module.exports = {
    pool,
    dbSetupQuery
}
