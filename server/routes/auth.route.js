const controller = require("../controllers/auth.controller.js");

module.exports = (app) => {
	// Route to handle SignUp requests
	app.post("/signup", controller.signup);

	// Route to handle SignIn requests
	app.post("/signin", controller.signin);
};
