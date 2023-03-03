module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define(
      "Image",
      {
        // PK
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        // relations - FK
        posts_id: DataTypes.INTEGER
      },
      {
        timestamps: false,
        tableName: 'images'
      }
    );
  
    Image.associate = (models) => {
      Image.belongsTo(models.Post, {
        foreignKey: "posts_id"
      });
    };
  
    return Image;
  };