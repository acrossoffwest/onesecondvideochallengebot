'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Message, { foreignKey: 'userId' });

      this.belongsToMany(models.Chat, {
        through: 'users_chats',
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
    },
    telegramUserId: {
      type: DataTypes.STRING,
      field: 'telegram_user_id'
    },
    active: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  });
  return User;
};