const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const config = require('../config/db.config');
const db = new Sequelize(config);

module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	console.log(req.headers);
	if (!authorization) {
		return res.status(401).json({ error: "You must be logged In." });
	}
	const token = authorization.replace("Bearer ", "");
	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			return res.status(401).json({ error: "You session has been expired." });
		}
		const { id } = payload;
        db.query("SELECT * FROM users WHERE id=:id LIMIT 1", {
            type: Sequelize.QueryTypes.SELECT,
            replacements: {
              id
            }
        }).then((userdata) => {
			// We make user data accessible
			req.user = userdata[0];
			next();
		});
	});
};
