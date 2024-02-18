const { User } = require('../models');

module.exports = async (ctx) => {
  const { from } = ctx.message;
  const [userModel, createdUser] = await User.findOrCreate({
    where: { telegramUserId: from.id },
    defaults: {
      name: from.first_name,
      username: from.username,
      telegramUserId: from.id
    }
  });
  return userModel;
}