var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID; 
var db = mongojs('mongodb://eash:Issiutng123@ds017514.mlab.com:17514/dmakvids2018', ['users']);
var jwt = require("jsonwebtoken");

router.post("/login", (req, res, next) => {
	let fetchedUser;
	db.findOne({ email: req.body.email })
	.then(user => {
		if (!user) {
			return res.status(401).json({
				message: "Auth failed"
			});
		}
		fetchedUser = user;
		return bcrypt.compare(req.body.password, user.password);
	})
	.then(result => {
		if (!result) {
			return res.status(401).json({
				message: "Auth failed"
			});
		}
		var token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id, 
			first_name: fetchedUser.first_name, last_name: fetchedUser.last_name}, 
			"secret_this_should_be_longer", 
			{expiresIn: "1h"}
		);
		res.status(200).json({
			token: token
		});
	})
	.catch(err => {
		return res.status(401).json({
			message: "Auth failed"
		});
	});

});

module.exports = router; 