const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');
const User = require('../models/user.js');
const resetlink = require('../models/reset.js');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');


// Register
router.post('/register', (req, res, next) => {
  let newUser = new User ({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
          // expiresIn: 30 // 30 seconds
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});


// POST to generate a link to Email the user
router.post("/fp", (req, res, next) => {
  // res.json({success: true, msg: 'url hit', username: username});
  const username = req.body.username;
  // console.log(username)

  
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    myLink = new resetlink({
      linkString: user._id,
      _id: new mongoose.Types.ObjectId()
    });

    // console.log(myLink)
    // res.json({success: true, msg: 'url hit', username: username, userid: user._id});

    myLink.save()
          .then(result => {
              // console.log(result);
              var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'apptest@ggktech.com', // Your email id
                    pass: 'Hyderabad007' // Your password
                }
              });
              var mailOptions = {
                  from: 'apptest@ggktech.com',  // sender
                  to: user.email, // reciever 

                  subject: 'Tour App: forgot password',
                  html: "<a href=https://tourapp-c65f9.firebaseapp.com/reset/" +user._id +">Click here to reset password</a>"  
              };
              // html: "<a href=http://localhost:4200/reset/" +user._id +">Click here to reset password</a>",

              transporter.sendMail(mailOptions, function(error, info){
                  if(error){
                      console.log(error);
                      res.json({yo: 'error'});
                  }else{
                      console.log('Message sent: ' + info.response);
                      res.json({yo: info.response});
                  };
              });
          })
          .catch(err =>{ console.log(err); console.log("error in save link")});
  });
});



// Patch User to reset Password
router.patch('/resetpassword/:userId', (req, res, next) => {
  const password = req.body.password;
  const userId = req.params.userId;
  console.log(userId);

  // find in the LINK table and calculate the time difference
  // between the link creation time and present time
  // if time is greater than 24hr then return failure
  // resetlink.find({})


  User.findOne({_id: userId})
    .exec()
    .then(doc => {
        // console.log(doc);
        if(doc){
          let newUser = new User();
          newUser = doc;
          newUser.password = req.body.password;

          console.log(newUser)
          // res.json({user: newUser});

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              User.update({_id: userId}, newUser)
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
          });
        } else {
            res.status(404).json({
                message: "userId not valid contact"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});


// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
