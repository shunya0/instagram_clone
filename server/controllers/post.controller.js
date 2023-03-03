const Sequelize = require('sequelize');
const config = require('../config/db.config');
const db = new Sequelize(config);
const {v4: uuidv4 } = require('uuid');
const fs = require('fs');

exports.allPost = async (req, res) => {
    let response = [];
    // SELECT posts.id, posts.users_id, images.image, images.id as image_id, likes.id as likes, posts.created_at FROM posts JOIN images ON posts.id=images.posts_id LEFT JOIN likes ON posts.id=likes.posts_id AND posts.users_id=likes.users_id ORDER BY posts.created_at DESC, posts.id
    // "SELECT * FROM posts JOIN images ON posts.id=images.posts_id ORDER BY created_at DESC, posts_id"
    db.query("SELECT posts.id, posts.users_id, images.image, images.id as image_id, likes.id as likes, posts.created_at FROM posts JOIN images ON posts.id=images.posts_id LEFT JOIN likes ON posts.id=likes.posts_id AND posts.users_id=likes.users_id ORDER BY posts.created_at DESC, posts.id", {
      type: Sequelize.QueryTypes.SELECT,
    }).then((posts) => {
      console.log(posts);
      let currentId = posts[0].id;
      let items = []
      let resObj = {
        created_at: posts[0].created_at,
        users_id: posts[0].users_id,
        posts_id: posts[0].id,
        like: posts[0].likes ? true : false
      }

      // Creating response object
      for (let i=0; i<posts.length; i++) {
        if (posts[i].id != currentId || i==(posts.length-1)) {
          currentId = posts[i].id;
          resObj.items = items;
          response.push(resObj);
          items = [];
          resObj = {
            created_at: posts[i].created_at,
            users_id: posts[i].users_id,
            posts_id: posts[i].id,
            like: posts[i].likes ? true : false
          }
        }

        // Creating base64 image from file
        let imgBase64 = fs.readFileSync(posts[i].image, 'base64');
        items.push({id: posts[i].image_id, image: imgBase64});
      }

      return response;
    }).then((response) => { res.json({response})});


};

exports.myPost = async (req, res) => {
    const Posts = await Post.findOne({
        where: {users_id: req.user.id},
        order: [
            ['created_at', 'DESC']
          ],
          include: [
          {
            model: Like,
            required: false,
            include: {
              model: User
            }      
        }]
    })
    res.json({ Posts });
};

exports.createPost = (req, res) => {
	const { title, body, photosEncoded, photoTypes } = req.body;
  console.log(req.user)
	if (!title || !body || !photosEncoded) {
		return res.json({
			error: "Please submit all the required fields.",
		});
	}
  
  let uid = uuidv4();
  db.query("INSERT INTO posts (id, created_at, updated_at, users_id) VALUES (:id, :created_at, :updated_at, :users_id)", {
    type: Sequelize.QueryTypes.INSERT,
    replacements: {
      id: uid,
      created_at: new Date(),
      updated_at: new Date(),
      users_id: req.user.id
    }
  }).then((savedPost) => {
    photosEncoded.forEach((photo, i, arr) => {
      let name = Math.random().toString(36).slice(2);
      let type = photoTypes[i].slice(-3);
      let img = '../imageStore/'+name+'.'+type;
      fs.writeFile(img, photo, {encoding: 'base64'}, (err) => {
        console.log('File Created')
      })
      db.query("INSERT INTO images (image, posts_id) VALUES (:image, :posts_id)", {
        type: Sequelize.QueryTypes.INSERT,
        replacements: {
          image: img,
          posts_id: uid
        }
      })

  })

  }).then( res.send({message: "Images saved successfully "}))
  
};

exports.like = async (req, res) => {
    db.query("INSERT INTO likes (created_at, posts_id, users_id) VALUES (:created_at, :posts_id, :users_id)", {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        created_at: new Date(),
        posts_id: req.body.postId,
        users_id: req.body.userId
      }
    }).then((result) => res.json({message: "Like stored successfully"}));  
};

exports.unlike = async (req, res) => {
    db.query("DELETE FROM likes WHERE posts_id=:posts_id AND users_id=:users_id", {
      type: Sequelize.QueryTypes.DELETE,
      replacements: {
        posts_id: req.body.postId,
        users_id: req.body.userId
      }
    }).then((result) => res.json({ message: "Like deleted successfully"}));  
};

exports.deletePost = async (req, res) => {
    await Post.destroy({
        where: {id: req.params.postId}
    })
};
