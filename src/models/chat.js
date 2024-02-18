'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Message, { foreignKey: 'chat_id' });

      this.hasMany(models.Video, { foreignKey: 'chat_id' });

      this.belongsToMany(models.User, {
        through: 'users_chats',
        foreignKey: 'chat_id'
      });
    }
  }
  Chat.init({
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    telegramChatId: {
      type: DataTypes.STRING,
      field: 'telegram_chat_id'
    }
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chats',
    timestamps: false
  });
  return Chat;
};