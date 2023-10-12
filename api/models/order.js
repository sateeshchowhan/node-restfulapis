const mongoose = require('mongoose'); 

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,   //mongoDB is a non-relational database
    //i want add product key and set this equal to an object and use required here so we can't pass null here
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, //ref should hold a string with name of model
    quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);