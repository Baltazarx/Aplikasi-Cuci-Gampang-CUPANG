const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rijik',
  port: 3306
});

connection.connect((error) => {
  if (error) {
    console.error('⚠️ Error connecting to MySQL:', error);
    process.exit(1);
  }
  console.log('✅ Successfully connected to MySQL database');
});

module.exports = connection;