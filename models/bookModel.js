const mysqlConnection = require('../config/dbConnection');

const insertBook = async (title, author, categoryName) => {
    const connection = await mysqlConnection();
    const query = `
        INSERT INTO Books (Title, Author, CategoryID)
        SELECT ?, ?, c.CategoryID
        FROM Categories AS c
        WHERE c.CategoryName = ?;
    `;

    const [result] = await connection.query(query, [title, author, categoryName]);
    return result;
};

module.exports = {
    insertBook
};
