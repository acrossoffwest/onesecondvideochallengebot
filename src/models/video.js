'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Video.init({
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    filepath: DataTypes.STRING,
    chatId: {
      type: DataTypes.NUMBER,
      field: 'chat_id'
    },
    createdAt: {
      type: DataTypes.STRING,
      field: 'created_at'
    }
  }, {
    sequelize,
    modelName: 'Video',
    tableName: 'videos',
    timestamps: false,
  });
  return Video;
};