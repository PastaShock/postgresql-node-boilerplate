const { db } = require('../db/connection')

const getAll = (req, res) => {
    db.query('SELECT * FROM privilege ORDER BY priv_id ASC;', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const getSingle = (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM privilege WHERE priv_id = $1;', [ id ], (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const postSingle = (req, res) => {
    const { name } = req.body
    db.query('INSERT INTO privilege name VALUES $1 RETURNING *',
        name,
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(201).send(`privilege added with priv_id: ${result.rows[0].id}`)
    } )
}
const updateSingle = (req, res) => {
    const id = req.params.id
    const name = req.body
    db.query('UPDATE privilege SET name = $1',
        [ id, name ],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`privilege updated with priv_id: ${result.rows[0].id}`)
    } )
}
const deleteSingle = (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM privilege WHERE priv_id = $1',
        id,
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`privilege deleted with priv_id: ${result.rows[0].id}`)
    } )
}

module.exports = {
    getAll,
    getSingle,
    postSingle,
    updateSingle,
    deleteSingle
}