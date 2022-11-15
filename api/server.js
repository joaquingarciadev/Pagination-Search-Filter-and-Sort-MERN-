const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Import environment variables
require("./config")

// Parse json
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

// Cors
app.use(
    cors({
        credentials: true,
        // origin: [],
    })
);

// Connect to DB
const { mongoose } = require('./database');

// Import routes
app.use("/api", require("./routes/product.route"));

app.listen(3001, () => {
    console.log('Server started on port 3001');
});