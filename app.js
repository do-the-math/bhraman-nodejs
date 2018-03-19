const express = require('express');
const bodyParser = require('body-parser');
const config = require('./api/config/database.js');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');


const userRoutes = require('./api/routes/users');
const catgoryRoutes = require('./api/routes/category');
const contactRoutes = require('./api/routes/contact');
const app = express();


// mongoose.connect('mongodb+srv://node-shop:root@node-shop-hcdwi.mongodb.net/test', {})

mongoose.connect(config.database, {});

mongoose.connection.on('connected', () => {
  console.log('Connected to Database '+config.database);
});
mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});


// Port Number
const port = process.env.PORT || 3000;

// CORS middleware
app.use(cors());
// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", '*');
// 	res.header(
// 		"Access-Control-Allow-Headers", 
// 		"Origin, X-Requested-With, Content-Type, Accept, Authorisation"
// 	);
// 	if(req.method === 'OPTIONS'){
// 		res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
// 		return res.status(200).json({});
// 	}
// 	next();
// })

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./api/config/passport.js')(passport);

app.use('/users', userRoutes);
app.use('/category', catgoryRoutes);
app.use('/contact', contactRoutes);

app.use((req, res, next) => {
	const error = new Error("not found");
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	})
})


module.exports = app;