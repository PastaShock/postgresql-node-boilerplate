import Router from 'express-promise-router';
import * as db from '../db.js';

//create exprewss-promise-router
const router = new Router();

export default router;

app.get('/:id', async (req, res, next) => {
	const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id])
	res.send (result.rows[0])
})
