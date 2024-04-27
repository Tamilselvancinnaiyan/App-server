const mysql = require('mysql2/promise');

const mysqlConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234567890',
      database: 'Thamizh'
    });

    console.log('Connected to the MySQL database');

    return connection; // Return the connection object
  } catch (err) {
    console.error('An error occurred:', err.message);
    throw err; // Throw error to handle it in the controller
  }
};

module.exports = mysqlConnection;
