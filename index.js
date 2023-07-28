const express = require('express');
const cors = require('cors');
const router = require('./routes/filehandler');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Connection URL and database name
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'appelOffert';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Use the router for handling specific routes
app.use('/', router);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
});
