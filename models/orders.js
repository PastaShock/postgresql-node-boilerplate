const { db } = require('../db/connection')

// list all orders (not a good idea except for testing)
const getAll = (req, res) => {
    db.query('SELECT * FROM orders ORDER BY order_id ASC;', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}

// get a single order by order_id / id
const getSingle = (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM orders WHERE order_id = $1;', [id], (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
// fixed data in the order row should be orderid (key), salesOrderId (key?), fundid, magentoId (key?), fundName, orderType, orderNotes, digital, digiSmall
// each order should have foreign keys linking it to a row in the jobs table
// the key should be jobId, and it should left append with printUser.name from users on user.id name from printers on printer.id
// the row in jobs should have an order id, it is a many to many relationship
// one job can be on or more order ids
// | job_id_uuid | order_id |  date_downloaded |    date_printed   |     print_user    | print_device |
// |-------------|----------|------------------|-------------------|-------------------|--------------|
// | 1230-239857 |  233649  | 2/26/2024 8:00am | 2/26/2024 8:00 am | 2/26/2024 8:00 am |      2       |

// which relates to the orders table on orders.order_id
// With a left append jobs where job id = x with orders with jobs.order_id on orders.order_id 
const postSingle = (req, res) => {
    const { orderId, salesOrder, fundId, fundName, placedDate, orderType, orderNotes, logoScript, priColor, secColor, logoId, digital, digiSmall } = req.body
    db.query('INSERT INTO orders ( orderId, salesOrder, fundId, fundName, placedDate, orderType, orderNotes, logoScript, priColor, secColor, logoId, digital, digiSmall ) VALUES ($1, $2, $3, $4) RETURNING *',
        [ orderId, salesOrder, fundId, fundName, placedDate, orderType, orderNotes, logoScript, priColor, secColor, logoId, digital, digiSmall ],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(201).send(`order added with ID: ${result.rows[0].id}`)
    } )
}
const updateSingle = (req, res) => {
    const id = req.params.id
    const { name, email, phone, hired } = req.body
    db.query('UPDATE orders SET name = $1, email = $2, phone = $3, hired = $4',
        [name, email, phone, hired],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`order updated with ID: ${result.rows[0].id}`)
    } )
}
const deleteSingle = (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM orders WHERE order_id = $1',
        [id],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`order deleted with ID: ${result.rows[0].id}`)
    } )
}

module.exports = {
    getAll,
    getSingle,
    postSingle,
    updateSingle,
    deleteSingle
}