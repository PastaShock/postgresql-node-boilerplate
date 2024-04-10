const fs = require('fs')

exports.logHandler = ({source, request, loglevel, dbquery, error}) => {
  // pre-baked catches for specific errors
  // I don't care enough to log duplicate posts/updates as they are rejected by the db regardless
  errorDuplicate = `error: duplicate key value violates unique constraint "orders_pkey"`
  if (error == errorDuplicate) {
    console.log('duplicate')
  } else {
    let content = {
      "datetime": Date(),
      "source" : source,
      "loglevel": loglevel,
      "userip": request.ip,
      "dbquery": dbquery,
      "error": JSON.stringify(error),
      "requestbody": JSON.stringify(request.body)
    }
    if (loglevel === 'severe') {
      var file = 'err_' + source
    } else {
      var file = 'access'
    }
    logContentHandler(content, file)
  }
}

function logContentHandler(content, filePath) {
  content = JSON.stringify(content)
  newLine = `,\n`
  filePath = 'logs/' + filePath + '.log'
  if (fs.existsSync(filePath).length === 0) {
    fs.writeFile(filePath, content, err => { console.log(err) } )
  } else {
    fs.appendFile(filePath, `,\n` + content, err => { err ? console.log(err):console.log(`appended: ${content}\nto ${filePath}`) })
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
  query.push('WHERE ' + table + '_id = ' + id);

  // Add a return to the query to get data back:
  query.push(`RETURNING *`)

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
