const { query } = require('express')
const { db } = require('../db/connection')
const { updateProductByID, postProductByID, errHandler, logHandler } = require('../index')

var log = {
    source: 'global',
    request: '',
    loglevel: 'low',
    dbquery: '',
    error: ''
}

// list all orders (not a good idea except for testing)
const getAll = (req, res) => {
    log.source = 'getAll'
    log.request = req
    let query = 'SELECT * FROM orders ORDER BY order_id ASC;'
    db.query(query, (error, result) => {
        log.dbquery = query
        if (error) {
            log.error = error
            log.loglevel = 'severe'
            logHandler(log)
            throw error
        }
        logHandler(log)
        res.status(200).json(result.rows)
    } )
}
const getMany = (req, res) => {
    log.source = 'getMany'
    log.request = req
    // verify that typeof req.body === 'object'
    if (typeof req.body === 'object') {
        let query = `SELECT * FROM orders WHERE order_id = ANY($1)`
        log.dbquery = query
        db.query(query, [req.body], (error, result) => {
            if (!error) {
                console.log(result.rows)
                logHandler(log)
                res.json(result.rows)
            } else {
                res.sendStatus(404)
                log.error = error
                log.loglevel = 'severe'
                logHandler(log)
                throw error
            }
        })
    } else {
        console.log(`req.body is not type of object`)
    }
}
// get a single order by order_id / id
const getSingle = (req, res) => {
    log.source = 'getSingle'
    log.request = req
    const id = req.params.id
    let query = 'SELECT * FROM orders WHERE order_id = $1;'
    log.dbquery = query
    db.query(query, [id], (error, result) => {
        if (error) {
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            log.error = `error: order id: ${id} does not exist in db`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            logHandler(log)
            res.status(200).json(result.rows)
        }
    } )
}
const getFundId = (req, res) => {
    log.source = 'getFundId'
    log.request = req
    const id = req.params.id
    let query = 'SELECT * FROM orders WHERE fundraiser_id = $1;'
    log.dbquery = query
    db.query(query, [id], (error, result) => {
        if (error) {
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            res.status(404).send('404')
        } else {
            logHandler(log)
            res.status(200).json(result.rows)
        }
    } )
}
const getMagento= (req, res) => {
    log.source = 'getMagento'
    log.request = req
    const id = req.params.id
    let query = 'SELECT * FROM orders WHERE magento_id = $1;'
    log.dbquery = query
    db.query(query, [id], (error, result) => {
        if (error) {
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            res.status(404).send('404')
        } else {
            logHandler(log)
            res.status(200).json(result.rows)
        }
    } )
}
function getOrdersByMagentoId(id) {
    let sql = `SELECT * FROM orders WHERE magento_id = $1`
    return new Promise((resolve, reject) => {
        db.query(sql, id, (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                console.log(err)
                reject(err)
            }
        })
    })
}

const getMagentoIds = (req, res) => {
    log.source = 'getMagentoIds'
    log.request = req
    // verify that typeof req.body === 'object'
    if (typeof req.body === 'object') {
        let query = `SELECT * FROM orders WHERE magento_id = ANY($1)`
        log.dbquery = query
        db.query(query, [req.body], (error, result) => {
            if (!error) {
                logHandler(log)
                res.json(result.rows)
            } else {
                log.error = error
                log.loglevel = 'severe'
                logHandler(log)
                res.sendStatus(404)
                throw error
            }
        })
    } else {
        console.log(`req.body is not type of object`)
    }
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
    log.source = 'postSingle'
    //
    // HERE: I should check to see how data from the json/response is handled so I could potentially save myself some typeing time
    // Right now this only works for powershell POSTs because powershell refuses to put single orders into an array
    // I will use the POST many method below for HTTP POST req for now
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
        let query = `
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
        ) RETURNING *`
    db.query(query,
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
                log.loglevel = 'severe'
                log.error = error
                log.dbquery = query
                logHandler(log)
                res.status(500).json(error)
            } else {
                log.dbquery = query
                logHandler(log)
                res.status(201).send(`order added with ID: ${orderId}`)
            }
    } )
}
const updateSingle = (req, res) => {
    var log = {
        source: 'updateSingle',
        request: req,
        loglevel: 'low',
        dbquery: '',
        error: ''
    } 
    // Make forEach to make multiple PUTs based on however many rows are given?
    // colValues takes each key and returns their assigned values in an array
    let colValues = Object.values(req.body[0])
    // func is from index, Table name is hardcoded 'order' singular the func takes the name and uses it singularly and pluraly as needed.
    let query = updateProductByID('order', req.params.id, req.body[0])
    db.query(query, colValues, (error, result) => {
        // Log in console, should also log in a user history log, separate from the err log.
        // console.log(`update: ${req.params.id}, from: ${req.ip}, query = ${query}, params: ${colValues}`)
        if (error) {
            log.dbquery = query
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            res.status(500).json(result)
            // throw error
        } else {
            log.dbquery = query
            logHandler(log)
            res.status(200).json(result.rows)
        }
    })
}
const deleteSingle = (req, res) => {
    log.source = 'deleteSingle'
    const id = req.params.id
    let query = 'DELETE FROM orders WHERE order_id = $1'
    log.dbquery = query
    db.query(query,
        [id],
        (error, result) => {
        if (error) {
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        logHandler(log)
        res.status(200).send(`order deleted with ID: ${id}`)
    } )
}
const postMany = (req, res) => {
    log.source = 'postMany'
    log.request = req
    function setStatusSuccess(results) {
        res.status(200).json(results)
    }
    // req.body should be an array, iterate through each obj in 
    var results
    req.body.forEach(order => {
        // create query with function giving table name and object
        var query = postProductByID('order', order)
        log.dbquery = query
        // create an array of the values from the object
        var colValues = Object.keys(order).map(function (key) {
            return order[key]
        }) 
        setStatusSuccess(db.query(query, colValues, (error, result) => {
            if (error) {
                log.error = error
                log.loglevel = 'severe'
                logHandler(log)
            } else {
                console.log(`post success : ${order}`)
                logHandler(log)
                return result.rows
            }
        }))
    });
}

module.exports = {
    getAll,
    getMany,
    getSingle,
    getFundId,
    getMagento,
    getMagentoIds,
    postSingle,
    postMany,
    updateSingle,
    deleteSingle
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