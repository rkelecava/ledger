// Define required packages
var restful = require('node-restful'),
    mongoose = restful.mongoose;

// Define our schema
var schema = new mongoose.Schema({
    date: {type: Date, default: Date.now()},
    description: String,
    type: String,
    amount: Number
});

// Return ledger model
module.exports = restful.model('ledger', schema);