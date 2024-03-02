exports.errHandler = (file, reqBody, severity, error) => {
    errorDuplicate = `error: duplicate key value violates unique constraint "orders_pkey"`
    if (error == errorDuplicate) {
        console.log('duplicate')
    } else {
        content = `${Date()} : ${severity} db.query error: ${error}\nrequest body:\n${reqBody}`
        console.log(content)
        fs.writeFile('logs/err_' + file + '.log', content, err => { console.log(err) })
        // res.status(200).send(`error: ${error} : ${JSON.stringify(reqBody)}`)
    }
}

exports.updateProductByID = (table, id, cols) => {
  // Setup static beginning of query
  var query = ['UPDATE ' + table + 's'];
  query.push('SET');

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(key + ' = ($' + (i + 1) + ')'); 
  });
  query.push(set.join(', '));

  // Add the WHERE statement to look up by id
  query.push('WHERE ' + table + '_id = ' + id );

  // Return a complete query string
  return query.join(' ');
}
exports.postProductByID = (table, cols) => {
  // Setup static beginning of query
  var query = ['INSERT INTO ' + table + 's ( ']

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = []
  var vals = []
  Object.keys(cols).forEach(function (key) {
    set.push(key)
  })
  query.push(set.join(', '))
  query.push(') VALUES (')
  Object.keys(cols).forEach(function (key, i) {
    vals.push('$' + (i + 1))
  })
  query.push(vals.join(', '))
  query.push(') RETURNING *;')

  // Return a complete query string
  return query.join(' ')
}