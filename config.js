require('dotenv').config()

const { Sequelize,QueryTypes  } = require('sequelize');
const db = process.env.ENV != "dev" ? process.env.P_DB : process.env.DB; 
const user = process.env.ENV != "dev" ? process.env.P_USER : process.env.USER; 
const pass = process.env.ENV != "dev" ? process.env.P_PASS : process.env.PASS; 
const sequelize = new Sequelize(db, user, pass, {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = {sequelize,QueryTypes};