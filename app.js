const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()


const productRoutes = require('./api/routes/product');
const OrderRoutes = require('./api/routes/order');

// MongoDB connection string
//const mongoURI = //`mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@node-rest-shop.xdow63p.mongodb.net/your-database-name`;

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOOSE_URI);
// mongoose.set('strictQuery', false);
// mongoose.connect('mongodb+srv://node-shop:Virat@18@node-rest-shop.xdow63p.mongodb.net/');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control_Allow-Headers",
        "Origin, X-Requested-With, Content_Type, Accept, Authorization" 
    );
    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
//Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',OrderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;