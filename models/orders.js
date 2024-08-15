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
// orders/
// I should find a way to add a cursor to load all orders in a paginated manner
// where the cursor increments with each additional request
const getAll = (req, res) => {
    // set log source to name of this function
    log.source = 'getAll'
    // set log request to this request
    log.request = req
    let query = 'SELECT * FROM orders ORDER BY order_id ASC;'
    db.query(query, (error, result) => {
        // set the log query to this query
        log.dbquery = query
        if (error) {
            // set log error
            log.error = error
            log.loglevel = 'severe'
            // send log to logHandler
            logHandler(log)
            throw error
        }
        // send log to logHandler
        logHandler(log)
        res.status(200).json(result.rows)
    } )
}
// orders/bulk
// with body containing many order_ids [12345678, 21238952, 23002594]
const getMany = (req, res) => {
    // set log params for this function+req
    log.source = 'getMany'
    log.request = req
    // verify that typeof req.body === 'object'
    if (typeof req.body === 'object') {
        let query = `SELECT * FROM orders WHERE order_id = ANY($1)`
        // set log query
        log.dbquery = query
        db.query(query, [req.body], (error, result) => {
            if (!error) {
                // log db access:
                logHandler(log)
                // set status and return db results
                res.status(200).json(result.rows)
            } else {
                // set status
                res.sendStatus(404)
                // set log error params
                log.error = error
                log.loglevel = 'severe'
                // log db access/api error
                logHandler(log)
                // crash the software
                throw error
            }
        })
    } else {
        // if req.body is not type of object log as non-fatal error
        log.error = 'error: req body is not of type Object'
        log.loglevel = 'alert'
        logHandler(log)
    }
}
// get a single order by order_id
// orders/:id
const getSingle = (req, res) => {
    // set log params
    log.source = 'getSingle'
    log.request = req
    const id = req.params.id
    // query is static, we just need one order_id
    let largeQuery = `
    SELECT
    o.order_id,
    o.sales_order_id,
    o.magento_id,
    o.fundraiser_id,
    o.fundraiser_name,
    o.placed_on_date,
    o.order_notes,
    o.order_type,
    o.logo_script,
    o.primary_color,
    o.secondary_color,
    o.logo_count_digital,
    o.logo_count_digital_small,
    o.logo_count_sticker,
    o.logo_count_embroidery,
    o.order_ns_url,
    jo.job_id,
    j.date_downloaded,
    j.date_printed,
    u.name AS user_name,
    p.nickname AS printer
    FROM orders o
    JOIN job_orders jo ON (o.order_id = jo.order_id)
    JOIN jobs j ON (jo.job_id = j.job_id)
    JOIN users u ON (j.print_user = u.user_id)
    JOIN printers p ON (j.print_device = p.equip_id)
    WHERE o.order_id = $1;
    `
    let query = `
    SELECT
    o.order_id,
    o.sales_order_id,
    o.magento_id,
    o.fundraiser_id,
    o.fundraiser_name,
    o.placed_on_date,
    o.order_notes,
    o.order_type,
    o.logo_script,
    o.primary_color,
    o.secondary_color,
    o.logo_count_digital,
    o.logo_count_digital_small,
    o.logo_count_sticker,
    o.logo_count_embroidery,
    jo.job_id,
    j.date_printed,
    o.order_ns_url
    FROM orders o
    JOIN job_orders jo ON (o.order_id = jo.order_id)
    JOIN jobs j ON (jo.job_id = j.job_id)
    WHERE o.order_id = $1;
    `
    // jo.job_id
    // JOIN job_orders jo ON (jo.order_id = o.order_id)
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}, ${id}`
    db.query('select * from orders where order_id = $1', [id], (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set params for non-fatal error and log to file
            log.error = `error: order id: ${id} does not exist in db`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            // I could append a sub-object to the return object to have a nested data structure
            // with more data and not interfere with the important data.
            // I want to include jobs and information about each job in the return
            // let query = 'SELECT * FROM jobs JOIN job_orders jo ON (jobs.job_id = jo.job_id) JOIN orders o ON (jo.order_id = o.order_id) WHERE o.order_id = $1'
            // let jobs = db.query(query, id, (error, result) => {
                // res.status(200).json.(result.rows)
            // })
            res.status(200).json(result.rows[0])
        }
    } )
}
// Get all jobs that contain an order_id
const getJobsByOrderId = (req, res) => {
    // set log params
    log.source = 'getJobsByOrderId'
    log.request = req
    const id = req.params.id
    // query is static, we just need one order_id
    let query = `
    SELECT
    *
    FROM
    job_orders
    WHERE order_id = $1
    `
    // jo.job_id
    // JOIN job_orders jo ON (jo.order_id = o.order_id)
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}, ${id}`
    db.query(query, [id], (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set params for non-fatal error and log to file
            log.error = `error: order id: ${id} does not exist in db`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            // I could append a sub-object to the return object to have a nested data structure
            // with more data and not interfere with the important data.
            // I want to include jobs and information about each job in the return
            // let query = 'SELECT * FROM jobs JOIN job_orders jo ON (jobs.job_id = jo.job_id) JOIN orders o ON (jo.order_id = o.order_id) WHERE o.order_id = $1'
            // let jobs = db.query(query, id, (error, result) => {
                // res.status(200).json.(result.rows)
            // })
            res.status(200).json({
                "job_ids" : 
                    result.rows.map(({job_id}) => {
                        return job_id
                    }),
        })
        }
    } )
}
// get orders by fundraiser id. this is not a unique ID it will return many orders potentially
// orders/fundraiser/:id
const getFundId = (req, res) => {
    // set log params
    log.source = 'getFundId'
    log.request = req
    const id = req.params.id
    let query = 'SELECT * FROM orders WHERE fundraiser_id = $1;'
    log.dbquery = query
    db.query(query, [id], (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set log error for 'not found'
            log.loglevel = 'alert'
            log.error = 'not found'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log success
            logHandler(log)
            res.status(200).json(result.rows)
        }
    } )
}
// Get one order by magento ID
// orders/magento
const getMagento= (req, res) => {
    // set log params
    log.source = 'getMagento'
    log.request = req
    const id = req.params.id
    let query = 'SELECT * FROM orders WHERE magento_id = $1;'
    log.dbquery = query
    db.query(query, [id], (error, result) => {
        if (error) {
            // set log error params
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set log error params for non-fatal error
            log.loglevel = 'alert'
            log.error = 'not found'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log success
            logHandler(log)
            res.status(200).json(result.rows)
        }
    } )
}

// get many orders by many magento IDs
// orders/magento/bulk/
const getMagentoIds = (req, res) => {
    // set log params
    log.source = 'getMagentoIds'
    log.request = req
    // verify that typeof req.body === 'object'
    if (typeof req.body === 'object') {
        let query = `SELECT * FROM orders WHERE magento_id = ANY($1)`
        log.dbquery = query
        db.query(query, [req.body], (error, result) => {
            if (error) {
                // set log error params
                log.error = error
                log.loglevel = 'severe'
                logHandler(log)
                res.sendStatus(404)
                throw error
            } else {
                // log success
                logHandler(log)
                res.json(result.rows)
            }
        })
    } else {
        // set log error params for non-fatal error
        log.error = 'req.body is not type of object'
        log.loglevel = 'alert'
        logHandler(log)
    }
}

// The following portion of this file is the Create, Update and Delete portion.
// I should have authentication on the following API endpoints

// Explainer:
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

// Post one order
// orders/:id
const postSingle = (req, res) => {
    // set log params
    log.source = 'postSingle'
    log.request = req
    //
    // HERE: I should check to see how data from the json/response is handled so I could potentially save myself some typeing time
    // Right now this only works for powershell POSTs because powershell refuses to put single orders into an array
    // I will use the POST many method below for HTTP POST req for now
    const {
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
        logo_id,
        primary_color,
        secondary_color,
        logo_count_digital,
        logo_count_digital_small,
        logo_count_sticker,
        logo_count_embroidery,
        print_user_name,
        print_job_id,
        print_device
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
            logo_id,
            primary_color,
            secondary_color,
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
        log.dbquery = query
    db.query(query,
        [
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
            logo_id,
            primary_color,
            secondary_color,
            logo_count_digital,
            logo_count_digital_small,
            logo_count_sticker,
            logo_count_embroidery,
            print_user_name,
            print_job_id,
            print_device
        ],
        (error, result) => {
            if (error) {
                // set value to check against for duplicates. This is the return from postgresql if there is and order that already exists with that ID
                errorDuplicate = `error: duplicate key value violates unique constraint "orders_pkey"`
                if (error == errorDuplicate) {
                    // set log params for duplicate orders
                    log.loglevel = 'alert'
                    log.error = error
                    console.log(`duplicate order: ${order_id}`)
                } else {
                    // set log params for fatal or other error
                    log.loglevel = 'severe'
                    log.error = error
                }
                logHandler(log)
                res.status(500).json(log.error)
            } else {
                // log success
                logHandler(log)
                res.status(201).send(`order added with ID: ${order_id}\n${JSON.stringify(result.rows)}`)
            }
    } )
}

// Update one order
// orders/:id
const updateSingle = (req, res) => {
    // set log params
    log.source = 'updateSingle'
    log.request = req
    // Make forEach to make multiple PUTs based on however many rows are given?
    // colValues takes each key and returns their assigned values in an array
    let colValues = Object.values(req.body[0])
    let id = req.params.id
    // updateProductByID() is from index, Table name is hardcoded 'order' singular the func takes the name and uses it singularly and pluraly as needed.
    let query = updateProductByID('order', [id], req.body[0])
    // As I currently require an ID in the URL params I should log that with the query
    log.dbquery = `${query}, ${id}`
    db.query(query, colValues, (error, result) => {
        if (error) {
            // set log error params
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            res.status(500).json(result)
            // throw error
        } else {
            // log success
            logHandler(log)
            res.status(200).json(JSON.stringify(result.rows))
        }
    })
}

// Delete one order
// orders/:id
const deleteSingle = (req, res) => {
    // set log params
    log.source = 'deleteSingle'
    log.request = req
    const id = req.params.id
    let query = 'DELETE FROM orders WHERE order_id = $1'
    // The ID is URL parameter and needs to be appended to log.query
    log.dbquery = `${query}, ${id}`
    db.query(query,
        [id],
        (error, result) => {
        if (error) {
            // set log error params
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        } else {
            // log success
            logHandler(log)
            res.status(200).send(`result: command ${result.command} row(s) ${result.rowCount} with id ${id}`)
        }
    } )
}

// POST many orders
// orders/bulk
const postMany = (req, res) => {
    // set log params
    log.source = 'postMany'
    log.request = req
    function setStatusSuccess(results) {
        res.status(200).json(results)
    }
    // req.body should be an array, iterate through each obj in req.body
    var results
    // Old Method:
    // req.body.forEach(order => {
    //     // create query with function giving table name and object
    //     var query = postProductByID('order', order)
    //     log.dbquery = query
    //     // create an array of the values from the object
    //     var colValues = Object.keys(order).map(function (key) {
    //         return order[key]
    //     }) 
    //     results += (db.query(query, colValues, (error, result) => {
    //         if (error) {
    //             log.error = error
    //             log.loglevel = 'severe'
    //             // logHandler(log)
    //         } else {
    //             console.log(`post success : ${order}`)
    //             // logHandler(log)
    //             return result.rows
    //         }
    //     }))
    // });
    // Generate a query based on the properties of given objects
    // Get an array of properties from each object
    // 
    // New Method:
    var query = postProductByID('order', req.body)
    var colValues = Object.keys(req.body).map(function (key) {
        return req.body[key]
    })
    console.log(query)
    db.query(query, colValues, (error, result) => {
        if (error) {
            console.log(error)
            res.status(500)
        } else {
            console.log('success')
            return result.rows
        }
    })
}

module.exports = {
    getAll,
    getMany,
    getSingle,
    getJobsByOrderId,
    getFundId,
    getMagento,
    getMagentoIds,
    postSingle,
    postMany,
    updateSingle,
    deleteSingle
}