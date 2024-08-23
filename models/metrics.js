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

// OrdersByPrinter
const getOrdersByPrinter = (req, res) => {
    // set log params for this function+req
    log.source = 'getOrdersByPrinter'
    log.request = req
    let query = `
    SELECT
        COUNT(o.order_id) AS num_orders,
        p.nickname AS printer_name
    FROM
        orders o 
    JOIN
        job_orders jo ON (o.order_id = jo.order_id) 
    JOIN
        jobs j ON (jo.job_id = j.job_id) 
    JOIN
        printers p ON (j.print_device = p.equip_id) 
    WHERE
        p.equip_id = p.equip_id
    GROUP BY
        p.equip_id;
    `
    // set log query
    log.dbquery = query
    db.query(query, (error, result) => {
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
}
// get a single order by order_id
// orders/:id
const getUnitsByPrinter = (req, res) => {
    // set log params
    log.source = 'getUnitsByPrinter'
    log.request = req
    // query is static, we just need one order_id
    let query = `
    SELECT
        sum(o.logo_count_digital) as total_quantity,
        p.nickname AS printer_name
    FROM
        printers p
    JOIN
        jobs j ON (p.equip_id = j.print_device)
    JOIN
        job_orders jo ON (j.job_id = jo.job_id)
    JOIN
        orders o ON (jo.order_id = o.order_id)
    WHERE
        p.equip_id = p.equip_id
    GROUP BY
        p.equip_id;
    `
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}`
    db.query(query, (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set params for non-fatal error and log to file
            log.error = `error: invalid request`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            res.status(200).json(result.rows)
        }
    } )
}

const getOrdersByUsers = (req, res) => {
    // set log params
    log.source = 'getOrdersByUsers'
    log.request = req
    // query is static, we just need one order_id
    let query = `
    SELECT
        count(o.order_id) as total_orders,
        u.name AS user_name
    FROM
        orders o
    JOIN
        job_orders jo ON (o.order_id = jo.order_id)
    JOIN
        jobs j ON (jo.job_id = j.job_id)
    JOIN
        users u ON (j.print_user = u.user_id)
    WHERE
        u.name = u.name
    GROUP BY
        u.name;
    `
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}`
    db.query(query, (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set params for non-fatal error and log to file
            log.error = `error: invalid request`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            res.status(200).json(result.rows)
        }
    } )
}

const getOrdersByUserID= (req, res) => {
    const id = req.params.id
    // set log params
    log.source = 'getOrdersByUserID'
    log.request = req
    // query is static, we just need one order_id
    let query = `
    SELECT
        count(o.order_id) as total_orders,
        u.name AS user_name
    FROM
        orders o
    JOIN
        job_orders jo ON (o.order_id = jo.order_id)
    JOIN
        jobs j ON (jo.job_id = j.job_id)
    JOIN
        users u ON (j.print_user = u.user_id)
    WHERE
        u.user_id = $1
    GROUP BY
        u.name;
    `
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}`
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
            log.error = `error: invalid request`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            res.status(200).json(result.rows)
        }
    } )
}

const getUnitsByUserByDay = (req, res) => {
    const id = req.params.id
    const date = req.params.date
    // set log params
    log.source = 'getUnitsByUserByDay'
    log.request = req
    // query is static, we just need one order_id
    let query = `
    SELECT
        SUM(o.logo_count_digital) + SUM(o.logo_count_digital_small) as total_units,
        u.name AS user_name
    FROM
        orders o
    JOIN
        job_orders jo ON (o.order_id = jo.order_id)
    JOIN
        jobs j ON (jo.job_id = j.job_id)
    JOIN
        users u ON (j.print_user = u.user_id)
    WHERE
        u.user_id = $1
        AND
        CAST(j.date_printed AS DATE) = $2
    GROUP BY
        u.name;
    `
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}`
    db.query(query, [id, date], (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set params for non-fatal error and log to file
            log.error = `error: invalid request`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            res.status(200).json(result.rows)
        }
    } )
}
const getJobsByDay = (req, res) => {
    var date = req.params.date
    // set log params
    log.source = 'getJobsByDay'
    log.request = req
    // query is static, we just need one order_id
    let query = `
    SELECT
        o.order_id,
        u.name AS user_name,
        j.job_id,
        j.date_printed,
        j.date_downloaded
    FROM
        jobs j
    JOIN
        job_orders jo ON (jo.job_id = j.job_id)
    JOIN
        orders o ON (jo.order_id = o.order_id)
    JOIN
        users u ON (j.print_user = u.user_id)
    WHERE
        CAST(j.date_printed AS DATE) = $1
    GROUP BY
        j.job_id,
        o.order_id,
        u.name
    `
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}`
    dateParam = Date.parse(date)
    console.log(`dateParam: ${dateParam} :: typeOf: ${typeof(dateParam)}`)
    if (typeof(dateParam) != 'number') {
        console.log(`dateParam is not type of number :: ${typeof(dateParam)}\nsetting to fallback val`)
        date = '2024-01-01';
    }
    db.query(query, [date], (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set params for non-fatal error and log to file
            log.error = `error: invalid request`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            res.status(200).json(result.rows)
        }
    } )
}

const getOrdersByDay = (req, res) => {
    var date = req.params.date
    // set log params
    log.source = 'getOrdersByDay'
    log.request = req
    // query is static, we just need one order_id
    let query = `
    SELECT
        COUNT(o.order_id) AS count_orders,
        u.name AS user_name
    FROM
        orders o
    JOIN
        job_orders jo ON (jo.order_id = o.order_id)
    JOIN
        jobs j ON (jo.job_id = j.job_id)
    JOIN
        users u ON (j.print_user = u.user_id)
    WHERE
        CAST(j.date_printed AS DATE) = $1
    GROUP BY
        u.name
    `
    // append id to the query as we won't know otherwise what the API request was for
    log.dbquery = `${query}`
    dateParam = Date.parse(date)
    console.log(`dateParam: ${dateParam} :: typeOf: ${typeof(dateParam)}`)
    if (typeof(dateParam) != 'number') {
        console.log(`dateParam is not type of number :: ${typeof(dateParam)}\nsetting to fallback val`)
        date = '2024-01-01';
    }
    db.query(query, [date], (error, result) => {
        if (error) {
            // set log error params and log to file
            log.loglevel = 'severe'
            log.error = error
            logHandler(log)
            throw error
        }
        if (result.rows.length == '' ) {
            // set params for non-fatal error and log to file
            log.error = `error: invalid request`
            log.loglevel = 'alert'
            logHandler(log)
            res.status(404).send('404')
        } else {
            // log successful access to file
            logHandler(log)
            // return success status and result
            res.status(200).json(result.rows)
        }
    } )
}

module.exports = {
    getOrdersByPrinter,
    getUnitsByPrinter,
    getOrdersByUsers,
    getOrdersByUserID,
    getUnitsByUserByDay,
    getJobsByDay,
    getOrdersByDay
}