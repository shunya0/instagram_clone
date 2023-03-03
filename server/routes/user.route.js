const loginmiddleware = require("../middleware/login.middleware");
const controller = require("../controllers/user.controller.js");

module.exports = (app) => {
	// Getting the user details by id
	app.get("/user/:id", loginmiddleware, controller.user);
};
