require('dotenv').config({path: '../../.env'});

module.exports = {
  db: {
    username: process.env.DB_USERNAME || "forge",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_DATABASE || "forge",
    port: process.env.DB_PORT || 2206,
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql"
  },
};