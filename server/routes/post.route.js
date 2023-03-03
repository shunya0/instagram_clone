const controller = require("../controllers/post.controller.js");
const loginmiddleware = require("../middleware/login.middleware.js");

module.exports = (app) => {
	// Getting all posts
	app.get("/allpost", loginmiddleware, controller.allPost);

	// Create a post
	app.post("/createpost", loginmiddleware, controller.createPost);

	// Like a post
	app.put("/like", loginmiddleware, controller.like);

	// Unlike a post
	app.put("/unlike", loginmiddleware, controller.unlike);
};
