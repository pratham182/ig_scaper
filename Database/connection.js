const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Connection with DB
const REMOTE_DB_STR = process.env.REMOTE_DB_STR;

const connection = mongoose.connect(REMOTE_DB_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((conn) => {
    console.log("DB Connected Successfully");
}).catch((err) => {
    console.error("DB not Connected, Some error:", err);
});

module.exports = connection;
