const { db } = require('./connection')

module.exports = {
    getAll(req, res) {
        db.query('SELECT * FROM users ORDER BY user_id ASC;', (error, result) => {
            if (error) {
                throw error
            }
            res.status(200).json(result.rows)
        } )
    },
    getSingle(req, res) {
        const id = req.params.id
        db.query('SELECT * FROM users WHERE user_id = $1;', [id], (error, result) => {
            if (error) {
                throw error
            }
            res.status(200).json(result.rows)
        } )
    }
}