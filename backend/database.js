var pg = require('pg')
var PGUSER = 'deploy'
var PGDATABASE = 'oscpushserver'
var config = {
    user: 'postgres', // name of the user account
    password: 'Bagel12',
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
  )
`;

module.exports = {
    pool,
    dbSetupQuery
}
