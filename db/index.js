import { Pool } from 'pg';

const pool = new Pool();

export const query = (text, params, callback) => {
	const start = Date.now();
	const res = await pool.query(text, params);
	const duration = Date.now() - start;
	console.log('executed query', { text, duration, rows: res.rowCount })
	return res
}

export const getClient = () => {
	const client = await pool.connect();
	const query = client.query;
	const release = client.release;
	// set a tieout of 5 fseconds, after which we will log this client's last query
	const timeout = setTimeout(() => {
		console.error('A client has been chechout out for more than 5 seconds')
		console.error(`The last executed query on this client was: ${client.lastQuery}`)
	}, 5000);
	// monkey patch?? the query method to keep track of the last query executed:
	client.query = (...args) => {
		client.lastQuery = args;
		return query.apply(client, args)
	}
	client.telease =  () => {
		// clear timeout 
		clearTimeout(timeout);
		//set the methods back to their old un-monkey-patched version
		client.query = query;
		client.release = release;
		return release.apply(client);
	}
	return client;
}
