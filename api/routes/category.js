const express = require('express');
const router = express.Router();
const Category = require('../models/category')
const mongoose = require('mongoose');


// all category
router.get('/all', (req, res, next) => {
    console.log("all /GET called")
    Category.find()
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
// for a user
router.get('/usercategories/:uid', (req, res, next) => {
    console.log("for a user /GET called")
	
	const uid = req.params.uid;
	//console.log(uid)
    Category.find({"userID": uid})
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
// post method at route /Category
router.post('/usercategory', (req, res, next) => {
    console.log("/POST category")
	
	//const uid = req.params.uid;
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
		userID: req.body.userID,
        count: req.body.count,
        date: req.body.date
    })
    category
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /category',
                Createdcategory: category
            });
        })
        .catch(err => console.log(err));
});
// get a perticular category
router.get('/usercategory/:categoryID', (req, res, next) => {
    console.log("/GET by ID category")

    const id = req.params.categoryID;
    Category.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
					message: "ID not valid"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});
// update a category
router.patch('/usercategory/:categoryID', (req, res, next) => {
    console.log("/PATCH by id category")

    const id = req.params.categoryID;
    const category = new Category({
        _id: req.body._id,
        name: req.body.name,
        count: req.body.count
    })
    Category.update({_id: id}, category)
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
// delete a category
router.delete('/usercategory/:categoryID', (req, res, next) => {
    console.log("/DELETE called category")
    const id = req.params.categoryID;
    Category.remove({_id: id})
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
