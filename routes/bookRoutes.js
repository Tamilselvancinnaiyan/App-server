const express = require('express');
const router = express.Router();
const {fetchAllUsers, fetchAllBooks, searchBooks, insertNewBook} = require('../controllers/bookController');

router.get('/book', async (req, res) => {
    try {
      await fetchAllUsers(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

router.post('/allBooks', async (req, res) => {
    try {
      await fetchAllBooks(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
router.post('/searchBook', async (req, res) => {
    try {
      await searchBooks(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  router.put('/updateBook', async (req, res) => {
    console.log("updateBook");
    try {
        // Assuming the parameters are sent in the request body
        const { title, author, categoryName } = req.body;
        console.log('Received in updateBook:', { title, author, categoryName });
        
        // Check if all parameters are provided
        if (!title || !author || !categoryName) {
            return res.status(400).json({ message: 'All parameters (title, author, categoryName) are required.' });
        }

        // Now call the function with the correct parameters
        const result = await insertNewBook(title, author, categoryName);
        res.status(200).json({ message: 'Book updated successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
