const express= require("express");
const dotenv = require ("dotenv").config();
const errorHandler= require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const mysqlConnection = require("./config/mysqlConnection");


connectDb();
mysqlConnection();
 
const app = express();
const port = process.env.PORT||5000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
app.use(express.json()); 

app.get ("/", (req,res) => {  
    res.send("Hello World"); 
});
app.use("/api/contacts", require("./routes/contactsRoutes") );
app.use("/api/users", require("./routes/userRoutes") );
app.use("/api/books", require("./routes/bookRoutes") );

app.use(errorHandler);

app.listen (port,() =>{
    console.log(`Server running in the port ${port}`); 
}); 