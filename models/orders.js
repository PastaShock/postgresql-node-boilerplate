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
    //
    // HERE: I should check to see how data from the json/response is handled so I could potentially save myself some typeing time
    //
    const { orderId, salesOrder, fundId, fundName, placedDate, orderType, orderNotes, logoScript, priColor, secColor, logoId, digital, digiSmall } = req.body
    db.query(`INSERT INTO orders (
            order_id, sales_order_id, fundraiser_id, fundraiser_name, placed_on_date, order_type, order_notes, logo_script, primary_color, secondary_color, logo_id, logo_count_digital, logo_count_digital_small
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) RETURNING *`,
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
    const { orderId, salesOrder, fundId, fundName, placedDate, orderType, orderNotes, logoScript, priColor, secColor, logoId, digital, digiSmall } = req.body
    db.query(`
        UPDATE orders SET
            order_id = $1,
            sales_order_id = $2,
            fund_id = $3,
            fundraiser_name = $4,
            placed_on_date = $5,
            order_type = $6,
            logo_script = $7,
            primary_color = $8,
            secondary_color = $9,
            logo_id = $10,
            logo_count_digital = $11,
            logo_count_digital_small = $12
            `,
        [ orderId, salesOrder, fundId, fundName, placedDate, orderType, orderNotes, logoScript, priColor, secColor, logoId, digital, digiSmall ],
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