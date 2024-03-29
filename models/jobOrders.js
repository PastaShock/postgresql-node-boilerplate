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
    db.query(`SELECT
            o.order_id,
            o.sales_order_id,
            o.magento_id,
            o.fundraiser_id,
            o.fundraiser_name,
            o.placed_on_date,
            j.date_downloaded,
            j.date_printed,
            o.order_type,
            o.order_notes,
            o.logo_script,
            o.primary_color,
            o.secondary_color,
            o.logo_id,
            o.logo_count_digital,
            o.logo_count_digital_small,
            o.logo_count_sticker,
            o.logo_count_embroidery,
            u.name as user_name,
            p.nickname as printer_nickname,
            j.print_queue
            FROM jobs j
            JOIN job_orders jo on (j.job_id = jo.job_id)
            JOIN orders o ON (jo.order_id = o.order_id)
            JOIN printers p ON (j.print_device = p.equip_id)
            JOIN users u on (j.print_user = u.user_id)
            WHERE j.job_id = $1;`
            , [id], (error, result) => {
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
    postSingle,
    postMany,
    updateSingle,
    deleteSingle,
    updateTest
}