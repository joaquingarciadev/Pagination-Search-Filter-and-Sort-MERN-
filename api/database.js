const mongoose = require('mongoose');

// Connect to DB
mongoose.connect(process.env.URL_DB, (err) => {
    if (err) throw err;
    console.log("Connected Database");
});

module.exports = mongoose;