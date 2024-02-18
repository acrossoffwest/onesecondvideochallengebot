'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });

      this.belongsTo(models.Chat, { foreignKey: 'chatId' });
    }
  }
  Message.init({
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    text: DataTypes.STRING,
    chatId: {
      type: DataTypes.NUMBER,
      field: 'chat_id'
    },
    userId: {
      type: DataTypes.NUMBER,
      field: 'user_id'
    },
    telegramMessageId: {
      type: DataTypes.STRING,
      field: 'telegram_message_id'
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: false,
  });
  return Message;
};