module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
      "Post",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        like: DataTypes.INTEGER,
        users_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        timestamps: false,
        tableName: 'posts'
      }
    );
  
    Post.associate = (models) => {
      Post.belongsTo(models.User, {
        foreignKey: "users_id"
      });
      Post.hasMany(models.Like, {
        foreignKey: "posts_id"
      });
    };
  
    return Post;
  };