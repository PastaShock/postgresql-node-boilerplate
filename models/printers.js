const { db } = require('../db/connection')

const getAll = (req, res) => {
    db.query('SELECT * FROM printers ORDER BY equip_id ASC;', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const getSingle = (req, res) => {
    // Get single value from URL encoded
    const id = req.params.id
    // Check if param is of type integer
    if (typeof id === 'number') {
        db.query('SELECT * FROM printers WHERE equip_id = $1;', [ id ], (error, result) => { if (error) { throw error }; res.status(200).json(result.rows) } )
    } else {
        db.query('SELECT * FROM printers WHERE nickname = $1;', [ id ], (error, result) => { if (error) { throw error }; res.status(200).json(result.rows) } )
    }
}
const postSingle = (req, res) => {
    const { name } = req.body
    db.query('INSERT INTO printers name VALUES $1 RETURNING *',
        name,
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(201).send(`printer added with equip_id: ${result.rows[0].id}`)
    } )
}
const updateSingle = (req, res) => {
    const id = req.params.id
    const name = req.body
    db.query('UPDATE printers SET name = $1',
        [ id, name ],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`printer updated with equip_id: ${result.rows[0].id}`)
    } )
}
const deleteSingle = (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM printers WHERE equip_id = $1',
        id,
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`printer deleted with equip_id: ${result.rows[0].id}`)
    } )
}

module.exports = {
    getAll,
    getSingle,
    postSingle,
    updateSingle,
    deleteSingle
}