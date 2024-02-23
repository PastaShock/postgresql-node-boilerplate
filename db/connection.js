// options for postgresql require
const initOptions = {
	capSQL: true
}
// postgresql require
const Pool = require('pg').Pool // pg-pool as per some tutorials
// const pgp = require('pg-promise')(initOptions) // pg-promise
const conString = { // connections parameters for postgres
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
}
const db = new Pool(conString) // db connection as connection pool
// const db = pgp(conString) // set pgp w/ constring as db

module.exports = {
    db
}