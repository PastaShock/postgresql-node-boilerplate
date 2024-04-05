const { db } = require('../db/connection')
const { updateProductByID, postProductByID, errHandler } = require('../index')

// list all orders (not a good idea except for testing)
const getAll = (req, res) => {
    db.query('SELECT * FROM orders ORDER BY order_id ASC;', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const getMany = (req, res) => {
    var ordArr = []
    req.body.forEach( id => {
        db.query(`SELECT * FROM orders WHERE order_id = $1`, [id], (error, result) => {
            if (error) throw error
            if (result.rows.length == '') {
                res.status(404).send(404)
            } else {
                // console.log(result.rows[0])
                // res.status(200).json(result.rows[0])
                ordArr.push(result.rows[0])
                return result.rows[0]
            }
        })
    })
    console.log(ordArr)
    res.status(200).json(ordArr)
}
// get a single order by order_id / id
const getSingle = (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM orders WHERE order_id = $1;', [id], (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length == '' ) {
            res.status(404).send('404')
        } else {
            res.status(200).json(result.rows)
        }
    } )
}
const getFundId = (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM orders WHERE fundraiser_id = $1;', [id], (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length == '' ) {
            res.status(404).send('404')
        } else {
            res.status(200).json(result.rows)
        }
    } )
}
const getMagento= (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM orders WHERE magento_id = $1;', [id], (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length == '' ) {
            res.status(404).send('404')
        } else {
            res.status(200).json(result.rows)
        }
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
    const {
        orderId,
        salesOrder,
        magentoId,
        fundId,
        fundName,
        placedDate,
        downloadDate,
        printDate,
        orderType,
        orderNotes,
        logoScript,
        priColor,
        secColor,
        logoId,
        digital,
        digiSmall,
        sticker,
        embroidery,
        printUser,
        jobId,
        printer
        } = req.body
    db.query(`
        INSERT INTO orders (
            order_id,
            sales_order_id,
            magento_id,
            fundraiser_id,
            fundraiser_name,
            placed_on_date,
            date_downloaded,
            date_printed,
            order_type,
            order_notes,
            logo_script,
            primary_color,
            secondary_color,
            logo_id,
            logo_count_digital,
            logo_count_digital_small,
            logo_count_sticker,
            logo_count_embroidery,
            print_user_name,
            print_job_id,
            print_device
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        ) RETURNING *`,
        [
            orderId,
            salesOrder,
            magentoId,
            fundId,
            fundName,
            placedDate,
            downloadDate,
            printDate,
            orderType,
            orderNotes,
            logoScript,
            priColor,
            secColor,
            logoId,
            digital,
            digiSmall,
            sticker,
            embroidery,
            printUser,
            jobId,
            printer
        ],
        (error, result) => {
            if (error) {
                console.log(req.body)
                errorDuplicate = `error: duplicate key value violates unique constraint "orders_pkey"`
                if (error == errorDuplicate) {
                    res.status(200).send('duplicate')
                } else {
                    res.status(200).send(`error: ${error} : ${JSON.stringify(req.body)}`)
                }
            } else {
                res.status(201).send(`order added with ID: ${orderId}`)
            }
    } )
}
const updateSingle = (req, res) => {
    var query = updateProductByID('order', req.params.id, req.body)
    var colValues = Object.keys(req.body).map(function (key) {
        return req.body[key]
    }) 
    db.query(query, colValues,(error, result) => {
        if (error) throw error
        res.status(200).send(`order updated with ID: ${id}: ${JSON.stringify(req.body)}\nresult: ${result}`)
    })
}
const deleteSingle = (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM orders WHERE order_id = $1',
        [id],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`order deleted with ID: ${id}`)
    } )
}
const updateTest = (req, res) => {
    var query = updateProductByID('order', req.params.id, req.body)
    var colValues = Object.keys(req.body).map(function (key) {
        return req.body[key]
    }) 
    db.query(query, colValues,(error, result) => {
        if (error) throw error
        res.status(200).send(result.rows[0])
    })
}
const postMany = (req, res) => {
    // req.body should be an array, iterate through each obj in 
    req.body.forEach(order => {
        // create query with function giving table name and object
        var query = postProductByID('order', order)
        // create an array of the values from the object
        var colValues = Object.keys(order).map(function (key) {
            return order[key]
        }) 
        db.query(query, colValues, (error, result) => {
            if (error) {
                errHandler('postMany', req.body, 'severe', error)
            }
        })
    });
    res.status(200).send(res.rows)
}

module.exports = {
    getAll,
    getMany,
    getSingle,
    getFundId,
    getMagento,
    postSingle,
    postMany,
    updateSingle,
    deleteSingle,
    updateTest
}
        // [{ 
        //     order_id: orderId,
        //     sales_order_id: salesOrder,
        //     magento_id: magentoId,
        //     fundraiser_id: fundId,
        //     fundraiser_name: fundName,
        //     placed_on_date: placedDate,
        //     date_downloaded: downloadDate,
        //     date_printed: printDate,
        //     order_notes: orderNotes,
        //     order_type: orderType,
        //     logo_script: logoScript,
        //     primary_color: priColor,
        //     secondary_color: secColor,
        //     logo_id: logoId,
        //     logo_count_digital: digital,
        //     logo_count_digital_small: digiSmall,
        //     print_user_name: printUser,
        //     print_job_id: jobId,
        //     print_device: printer
        //     }, id],