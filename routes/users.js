const router = require('express').Router()
const { db } = require('../db/connection')

router.get('/', (req, res, next) => {
	res.json({ msg: "user route front end" })
})

router.get('/:id', async (req, res, next) => {
	const result = await db.query('SELECT * FROM users WHERE user_id = $1', [req.params.id])
	res.send (result.rows[0])
})

module.exports = router