module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define(
      "Like",
      {
        // PK
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        // relations - FK
        posts_id: DataTypes.INTEGER,
        users_id: DataTypes.INTEGER,
        // timestamps
        created_at: DataTypes.DATE,
      },
      {
        timestamps: false,
        tableName: 'likes'
      }
    );
  
    Like.associate = (models) => {
      Like.belongsTo(models.User, {
        foreignKey: "users_id"
      });
      Like.belongsTo(models.Post, {
        foreignKey: "posts_id"
      });
    };
  
    return Like;
  };