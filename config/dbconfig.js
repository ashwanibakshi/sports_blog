const mysql  = require('mysql')

var connect = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'blog'
  });

  module.exports=connect;