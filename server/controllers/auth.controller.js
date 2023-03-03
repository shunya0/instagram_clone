const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const config = require('../config/db.config');
const db = new Sequelize(config);
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// SignUp Controller
exports.signup = (req, res) => {
	const { name, email, username, password } = req.body;
	console.log(req.body)
	// Verifying if one of the fields is Empty
	if (!name || !password ||!username || !email) {
		return res.json({ error: "Please submit all required field" });
	}
	// Else we search the user with the credentials submitted
    db.query("SELECT * FROM users WHERE email=:email LIMIT 1", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          email
        }
    }).then((savedUser) => {
			// Verify if the user exist in the DB
			console.log(savedUser)
			if (savedUser.length > 0) {
				return res.json({ error: "This Email Is Already Used !" });
			}
			// We Hash the pwd before save into DB, more the number is high more it's more secure
			bcrypt.hash(password, 12).then((hashedPwd) => {
                db.query("INSERT INTO users (name, email, username, password, created_at, updated_at) VALUES(:name, :email, :username, :password, :created_at, :updated_at)", { 
                    type: Sequelize.QueryTypes.INSERT, 
                    replacements: {
                      name, 
                      email, 
                      username, 
                      password: hashedPwd, 
                      created_at: new Date(), 
                      updated_at: new Date()
                    } 
                  }).then((user) => {
						res.json({ message: "Saved successfully " });
					})
					.catch((err) => {
						console.log(err);
					});
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// SignIn Controller
exports.signin = (req, res) => {
	const { email, password } = req.body;
	// Verification for an empty field
	if (!email || !password) {
		return res.json({ error: "Please provide Email or Password" });
	}
	// Check if email exist in our DB
    db.query("SELECT * FROM users WHERE email=:email LIMIT 1", {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          email
        }
    }).then((savedUser) => {
			if (!savedUser) {
				return res.json({ error: "Invalid Email or Password" });
			}
			userObj = savedUser[0];
			console.log(userObj);
			bcrypt.compare(password, userObj.password).then((doMatch) => {
				if (doMatch) {
					// we will generate the token based on the ID of user
					const token = jwt.sign({ id: userObj.id }, process.env.JWT_SECRET);
					// retrieve the user info details and send it to the front
					const { id, username, name, email } = userObj;
					res.json({ token, user: { id, username, name, email } });
				} else {
					return res.json({
						error: "Invalid Email or Password",
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

