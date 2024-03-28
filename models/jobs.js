const { db } = require('../db/connection')
const { updateProductByID, postProductByID, errHandler } = require('../index')

// list all jobs (not a good idea except for testing)
const getAll = (req, res) => {
    db.query('SELECT * FROM jobs;', (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).json(result.rows)
    } )
}
const getMany = (req, res) => {
    var ordArr = []
    req.body.forEach( id => {
        db.query(`SELECT * FROM jobs WHERE job_id = $1`, [id], (error, result) => {
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
    db.query('SELECT * FROM jobs WHERE job_id = $1;', [id], (error, result) => {
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
        jobId,
        downloadDate,
        printDate,
        printUser,
        printer
        } = req.body
    db.query(`INSERT INTO jobs (
        job_id,
        date_downloaded,
        date_printed,
        print_user,
        print_device
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING *`,
        [ jobId,
		 downloadDate,
		 printDate,
		 printUser,
		 jobId,
		 printer ],
        (error, result) => {
            if (error) {
                console.log(req.body)
                errorDuplicate = `error: duplicate key value violates unique constraint "jobs_pkey"`
                if (error == errorDuplicate) {
                    res.status(200).send('duplicate')
                } else {
                    res.status(200).send(`error: ${error} : ${JSON.stringify(req.body)}`)
                }
            } else {
                res.status(201).send(`job added with ID: ${jobId}`)
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
    db.query('DELETE FROM jobs WHERE job_id = $1',
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