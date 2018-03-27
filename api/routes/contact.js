const express = require('express');
const router = express.Router();
const Contact = require('../models/contact')
const mongoose = require('mongoose');


// all Contact
router.get('/all', (req, res, next) => {
    console.log("all /GET called");
	
    Contact.find()
        .exec()
        .then( docs => {
            //console.log(docs)
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});
// all contacts for a user
router.get('/usercontacts/:uid', (req, res, next) => {
    //console.log("A user /GET called")
	
	const uid = req.params.uid;
    Contact.find({"userID": uid })
        .exec()
        .then( docs => {
            //console.log(docs)
            res.status(200).json(docs);
        })
        .catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

// POST method at route /Contact
router.post('/usercontact', (req, res, next) => {
    console.log("/POST called here")
	
	const uid = req.params.uid;
    const contact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
		userID: req.body.userID,
        categoryID: req.body.categoryID,
        location: req.body.location,
        date: req.body.date,
        notes: req.body.notes,
        position: req.body.position
    })
    contact
        .save()
        .then(result => {
            //console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /contact',
                createdContact: contact
            });
        })
        .catch(err => console.log(err));


});
// GET ALL Contacts with CategoryID
router.get('/usercontact/:uid/:categoryID', (req, res, next) => {
    var categoryID = req.params.categoryID;
	const uid = req.params.uid;
    //console.log("/GET   "+categoryID +" called categoryID")
    
    Contact.find({
				"categoryID": categoryID,
				"userID": uid
			})
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "ID not valid contact"
                })
            }
            // res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});
// GET one contact by ID
router.get('/usercontact/:contactID', (req, res, next) => {
    var contactID = req.params.contactID;
   /// console.log("/GET   "+contactID +" called _id")
    
    Contact.find({ _id: contactID })
        .exec()
        .then(doc => {
            //console.log(doc);

            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "ID not valid contact"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});
// patch by ID
router.patch('/usercontact/:contactID', (req, res, next) => {
    const id = req.params.contactID;
    //console.log("/PATCH   "+id +" called _id")

    const contact = new Contact({
        _id: req.body._id,
        categoryID: req.body.categoryID,
		userID: req.body.userID,
        name: req.body.name,
        location: req.body.location,
        position: req.body.position,
        notes: req.body.notes
    })

    Contact.update({_id: id}, contact)
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
// delete by ID
router.delete('/usercontact/:contactID', (req, res, next) => {
    //console.log("/DELETE called of contact")

    const id = req.params.contactID;
    console.log(id);
    Contact.remove({_id: id})
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
