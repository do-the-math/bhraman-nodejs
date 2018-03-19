const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose');



router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
    console.log("/GET called")
    Product.find()
        .exec()
        .then( docs => {
            console.log(docs)
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.post('/', (req, res, next) => {
    // var product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    // console.log(req.body);

    // save the data in database
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                Createdproduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err})
        });


});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: 'You discovered the special ID',
    //         id: id
    //     });
    // } else {
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     });
    // }
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("from databse ",doc);
            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No valid entry found with given ID"
                })
            }
            // res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});



///
router.patch('/:productId', (req, res, next) => {
    // res.status(200).json({
    //     message: ""
    // })
    const id = req.params.productId;
    // Product.update({_id: id}, { $set: {
    //     name: req.body.newName,
    //     price: req.body.newPrice
    // }})

    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps })
        .exec()
        .then( result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then( result => {
            res.status(200).json(result);
        })
        .catch( err =>{
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
