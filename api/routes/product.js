const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/search/:key', async(req, res, next) => {
     let data = await Product.find({
       $or:[
         {name:{$regex:req.params.key}}
       ]
    })
    //  we can pass wt we want to fetch like name,price,ids no other field
     .select('name price _id')
     .exec()
     .then(docs => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {  //using map bcz i'll get individual doct fetch
            return {
              name: doc.name,
              price: doc.price,
              _id:doc._id,
              request: {
                type:'GET',
                url:'http://localhost:3000/products/'+ doc._id
              }
            }
          })
        };
        //if (docs.length >= 0) {
            res.status(200).json(response);
        // } else {
        //     res.status(404).json({
        //         message: 'No entries found'
        //     });
        // }
    }) 
       .catch(err => {
           console.log(err);
           res.status(500).json({
            error: err
           });
     });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
           console.log(result);
           res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
              name:result.name,
              price:result.price,
              _id: result._id,
              request: {
                type: 'GET',
                url: "http://localhost:3000/products/"+ result._id
              }
            }
           });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
            
});

router.get('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
              res.status(200).json({
                product:doc,
                request: {
                  type: 'GET',
                  url: 'http://localhost:3000/products'
                }
              });
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const upDateOps = {};
    for (const ops of req.body) {
        upDateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, { $set: upDateOps})
      .exec()
      .then(result => {
        res.status(200).json({
          message:'Product updated',
          request:{
            type:'GET',
            url:'http://localhost:3000/products/'+ id  //ID which fetch from the url
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
      });
});

router.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId;
  
    Product.deleteMany({ _id: productId })
      .exec()
      .then(result => {
        if (result.deletedCount === 1) {
          res.status(200).json({
            message: 'Product deleted',
            productId: productId
          });
        } else {
          res.status(404).json({
            message: 'Product not found'
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;