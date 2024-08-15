const { db } = require('../db/connection')
const { updateProductByID, postProductByID, errHandler } = require('../index')

// list all job_orders (not a good idea except for testing)
const getAll = (req, res) => {
    db.query('SELECT * FROM job_orders;', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const getMany = (req, res) => {
    var ordArr = []
    req.body.forEach( id => {
        db.query(`SELECT * FROM job_orders WHERE job_id = $1`, [id], (error, result) => {
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
// get a single job by job_id / id
const getSingle = (req, res) => {
    const id = req.params.id
    let largeQuery = `
        SELECT
        o.order_id,
        o.fundraiser_name,
        o.order_type,
        u.name,
        p.nickname,
        j.date_printed
        FROM job_orders
        LEFT JOIN jobs j ON (job_orders.job_id = j.job_id)
        RIGHT JOIN orders o ON (job_orders.order_id = o.order_id)
        RIGHT JOIN users u ON (j.print_user = u.user_id)
        RIGHT JOIN printers p ON (j.print_device = p.equip_id)
        WHERE job_orders.job_id = $1;
    `
    let query = `SELECT order_id FROM job_orders WHERE job_id = $1`
    db.query(query, [id], (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length == '' ) {
            res.status(404).send('404')
        } else {
            res.status(200).json({
                // "id" : id,
                // "req" : req.body,
                // "status" : '200',
                "order_ids" : 
                    result.rows.map(({order_id}) => {
                        return order_id
                    }),
                // "result" : result
            })
        }
    } )
}

const getJobs = (req, res) => {
    const id = req.params.id
    let largeQuery = `
        SELECT
        jo.job_id,
        j.date_printed,
        u.name,
        p.nickname AS print_device_name
        FROM job_orders jo
        JOIN jobs j ON (jo.job_id = j.job_id)
        JOIN printers p ON (j.print_device = p.equip_id)
        JOIN users u ON (j.print_user = u.user_id)
        WHERE jo.order_id = $1;
    `
        // WHERE jo.order_id = $1;
            // select sum(o.logo_count_digital) as total_quantity
            // from printers p
            // join jobs j on p.equip_id = j.print_device
            // join job_orders jo on j.job_id = jo.job_id
            // join orders o on jo.order_id = o.order_id
            // where p.nickname = $1
    let query = `
        SELECT
        job_orders.job_id
        FROM job_orders
        WHERE job_orders.order_id = $1;
    `
    db.query(largeQuery, [id], (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length == '' ) {
            res.status(404).send('404')
        } else {
            res.status(200).json({
                "id" : id,
                "req" : req.body,
                "status" : '200',
                "job_ids" : 
                    result.rows.map(({job_id}) => {
                        return job_id
                    }),
                "result" : result
            })
        }
    } )
}

const postSingle = (req, res) => {
    const {
        job_id,
        order_id
        } = req.body
    db.query(`INSERT INTO job_orders (
        job_id,
        order_id
            ) VALUES (
                $1, $2
            ) RETURNING *`,
        [
            job_id,
		    order_id
        ],
        (error, result) => {
            if (error) {
                console.log(req.body)
                errorDuplicate = `error: duplicate key value violates unique constraint "job_orders_pkey"`
                if (error == errorDuplicate) {
                    res.status(200).send('duplicate')
                } else {
                    res.status(200).send(`error: ${error} : ${JSON.stringify(req.body)}`)
                }
            } else {
                res.status(201).send(`job added with ID: ${job_id}`)
            }
    } )
}
const updateSingle = (req, res) => {
    var query = updateProductByID('job', req.params.id, req.body)
    var colValues = Object.keys(req.body).map(function (key) {
        return req.body[key]
    }) 
    db.query(query, colValues,(error, result) => {
        if (error) throw error
        res.status(200).send(`job updated with ID: ${id}: ${JSON.stringify(req.body)}\nresult: ${result}`)
    })
}
const deleteSingle = (req, res) => {
    const id = req.params.id
    db.query('DELETE FROM job_orders WHERE job_id = $1',
        [id],
        (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`job deleted with ID: ${id}`)
    } )
}
const updateTest = (req, res) => {
    var query = updateProductByID('job', req.params.id, req.body)
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
    req.body.forEach(job => {
        // create query with function giving table name and object
        var query = postProductByID('job', job)
        // create an array of the values from the object
        var colValues = Object.keys(job).map(function (key) {
            return job[key]
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
    getJobs,
    postSingle,
    postMany,
    updateSingle,
    deleteSingle,
    updateTest
}