const {Post, User } = require('../models');

exports.user = async (req, res) => {
    const user = await User.findOne({ where: {id: req.params.id }});
    const posts = await Post.findAll({ where: {users_id: req.params.id }});
    res.send({ user, posts });
};

