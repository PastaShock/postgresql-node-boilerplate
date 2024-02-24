const { db } = require('../db/connection')

const getAll = (req, res) => {
    db.query('SELECT * FROM users ORDER BY user_id ASC;', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const getSingle = (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM users WHERE user_id = $1;', [id], (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const postSingle = (req, res) => {
    const { name, email, phone, hired } = req.body
    db.query('INSERT INTO users (name, email, phone, hired) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, phone, hired],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(201).send(`user added with ID: ${result.rows[0].id}`)
    } )
}
const updateSingle = (req, res) => {
    const id = req.params.id
    const { name, email, phone, hired } = req.body
    db.query('UPDATE users SET name = $1, email = $2, phone = $3, hired = $4',
        [name, email, phone, hired],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`user updated with ID: ${result.rows[0].id}`)
    } )
}
const deleteSingle = (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM users WHERE user_id = $1',
        [id],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`user deleted with ID: ${result.rows[0].id}`)
    } )
}

module.exports = {
    getAll,
    getSingle,
    postSingle,
    updateSingle,
    deleteSingle
}