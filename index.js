const fs = require('fs')

exports.logHandler = ({source, request, loglevel, dbquery, error}) => {
  // pre-baked catches for specific errors
  // I don't care enough to log duplicate posts/updates as they are rejected by the db regardless
  let content = {
    "datetime": Date(),
    "source" : source,
    "loglevel": loglevel,
    "userip": request.ip,
    "dbquery": dbquery,
    "error": JSON.stringify(error),
    "requestbody": JSON.stringify(request.body)
  }
  errorDuplicate = `error: duplicate key value violates unique constraint "orders_pkey"`
  if (error == errorDuplicate) {
    content.error = 'duplicate'
    content.loglevel = 'alert'
  } else {
    if (loglevel === 'severe') {
      source = 'err_' + source
    } else {
      source = 'access'
    }
  }
  logContentHandler(content, source)
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
  query.push('WHERE ' + table + '_id = \'' + id + '\'');

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

exports.postProductsByID = (table, cols) => {
  // Setup static beginning of query
  var query = ['INSERT INTO ' + table + 's ( ']
  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = []
  var vals = []
  function getColumnNames(cols) {
    // get names of all given columns into an array:
    Object.keys(cols).forEach(function (key) {
      set.push(key)
    })
  }
  function removeDuplicates(data) {
    return [...new Set(data)]
  }
  // check if valid object is given properly?
  // if [0] is not 'order_id' then loop through getColumnsNames() for every order given
  if (Object.keys(cols)[0] === 'order_id') {
    console.log('one object given')
    getColumnNames(cols)
  } else if (Object.keys(cols[0])[0] === 'order_id') {
    console.log('loop through multiple given objects')
    for (let i = 0; i < cols.length; i++) {
      getColumnNames(cols[i])
    }
  } else {
    console.log('order_id not given or it is not the first item in the object')
  }
  // remove duplicates from var set
  set = removeDuplicates(set)
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