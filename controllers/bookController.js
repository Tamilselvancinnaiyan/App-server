const asyncHandler = require("express-async-handler");
const mysqlConnection = require('../config/mysqlConnection');
const { insertBook } = require('../models/bookModel');


const fetchAllUsers = asyncHandler(async (req, res) => {
    const connection = await mysqlConnection(); 
    const [rows, fields] = await connection.query('SELECT * FROM users');
    console.log('Query result:', rows);
    res.json(rows);  
  });

  const fetchAllBooks = asyncHandler(async (req, res) => {
    try {
        const { limit, offset } = req.body; 
        const parsedLimit = parseInt(limit);
        const parsedOffset = parseInt(offset);
        if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
            return res.status(400).json({ message: "Invalid limit or offset value" });
        }
        const connection = await mysqlConnection();
        const query = `
            SELECT b.BookID, b.Title, b.Author, c.CategoryName
            FROM Books AS b
            JOIN Categories AS c ON b.CategoryID = c.CategoryID
            LIMIT ${limit} OFFSET ${offset}
        `;
        const [queryResult] = await connection.query(query);
        const booksWithAuthors = queryResult.map(book => ({
            BookID: book.BookID,
            Title: book.Title,
            Author: book.Author,
            CategoryName: book.CategoryName
        }));
        res.json(booksWithAuthors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const searchBooks = asyncHandler(async (req, res) => {
    try {
        const { searchTerm, limit , offset  } = req.body;
        const connection = await mysqlConnection();

        const query = `
            SELECT b.BookID, b.Title, b.Author, c.CategoryName
            FROM Books AS b
            JOIN Categories AS c ON b.CategoryID = c.CategoryID
            WHERE b.Title LIKE ? OR b.Author LIKE ? OR c.CategoryName LIKE ?
            LIMIT ? OFFSET ?;
        `;
        const searchTermWithWildcard = `%${searchTerm}%`;
        const queryParams = [searchTermWithWildcard, searchTermWithWildcard, searchTermWithWildcard, limit, offset];
        const [queryResult] = await connection.query(query, queryParams);
        const booksWithAuthors = queryResult.map(book => ({
            BookID: book.BookID,
            Title: book.Title,
            Author: book.Author,
            CategoryName: book.CategoryName
        }));

        res.json(booksWithAuthors);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


const insertNewBook = async (title, author, categoryName) => {
    try {
        try {
            const connection = await mysqlConnection();
        } catch (error) {
            console.log('Error connecting to the database:', error);
        }
       
        if (!connection) {
            throw new Error('Failed to obtain a valid database connection');
        }

        // Start transaction
        await connection.beginTransaction();

        // Step 1: Ensure the category exists and get the CategoryID
        let query = `SELECT CategoryID FROM Categories WHERE CategoryName = ?;`;
        let [categories] = await connection.query(query, [categoryName]);

        let categoryId;
        if (categories.length > 0) {
            categoryId = categories[0].CategoryID;
        } else {
            // If category does not exist, insert it
            query = `INSERT INTO Categories (CategoryName) VALUES (?);`;
            const [categoryResult] = await connection.query(query, [categoryName]);
            categoryId = categoryResult.insertId;
        }

        // Step 2: Insert the book with the obtained CategoryID
        query = `INSERT INTO Books (Title, Author, CategoryID) VALUES (?, ?, ?);`;
        const [bookResult] = await connection.query(query, [title, author, categoryId]);

        // Commit the transaction
        await connection.commit();

        return { bookResult, categoryId };
    } catch (error) {
        if (connection) {
            await connection.rollback(); // Rollback transaction on error
        }
        console.error('Error inserting new book:', error);
        throw error;
    }
};







  
module.exports =  {fetchAllUsers,fetchAllBooks, searchBooks, insertNewBook} 
