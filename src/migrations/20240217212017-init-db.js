'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        telegram_user_id VARCHAR(255),
        active TINYINT(1),
        name VARCHAR(255),
        username VARCHAR(255),
        PRIMARY KEY (id)
      );
    `);
    await queryInterface.sequelize.query(`
      CREATE TABLE chats (
        id INT NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        telegram_chat_id VARCHAR(255),
        name VARCHAR(255),
        PRIMARY KEY (id)
      );
    `);
    await queryInterface.sequelize.query(`
      CREATE TABLE videos (
        id INT NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        filepath VARCHAR(255),
        chat_id INT,
        PRIMARY KEY (id),
        FOREIGN KEY (chat_id) REFERENCES chats(id)
      );
    `);await queryInterface.sequelize.query(`
      CREATE TABLE messages (
        id INT NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        text TEXT,
        telegram_message_id VARCHAR(255),
        chat_id INT,
        user_id INT,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (chat_id) REFERENCES chats(id)
      );
    `);
    await queryInterface.sequelize.query(`
      CREATE TABLE users_chats (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        chat_id INT NOT NULL,
        PRIMARY KEY (id)
      );
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};