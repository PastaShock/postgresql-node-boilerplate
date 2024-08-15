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
    db.query('SELECT * FROM printers WHERE equip_id = $1;', [ id ], (error, result) => { if (error) { throw error }; res.status(200).json(result.rows) } )
}
const getSingleByName = (req, res) => {
    // Get single value (string) from URL encoded
    const id = req.params.id
    let query = `
    SELECT
    p.nickname,
    p.equip_id,
    p.install_date,
    p.mfg_serial,
    jo.job_id
    FROM printers p
    JOIN jobs j ON (p.equip_id = j.print_device)
    JOIN job_orders jo ON (j.job_id = jo.job_id)
    WHERE p.nickname = $1;
    `
    // select all orders that were printed on the desired printer
    let orderQuery = `
    SELECT
    o.order_id,
    p.nickname
    FROM orders o
    JOIN job_orders jo ON (o.order_id = jo.order_id)
    JOIN jobs j ON (jo.job_id = j.job_id)
    JOIN printers p ON (j.print_device = p.equip_id)
    `
    // SUM(o.logo_count_digital) AS logos_printed
    db.query(query, [ id ], (error, result) => { if (error) { throw error }; res.status(200).json(result.rows[0]) } )
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
    getSingleByName,
    postSingle,
    updateSingle,
    deleteSingle
}