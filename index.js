require('dotenv').config()
const express = require('express');
const app = express();
const port = 5020;

const { Sequelize  } = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASS, {
    host: 'localhost',
    dialect: 'mysql'
  });
//  console.log(process.env.DB,process.env.USER,process.env.PASS)

app.use(express.static('public'));

// Set View's
app.set('views', './public/view');
app.set('view engine', 'ejs');

const home  = require('./routes/index.js');

app.use('/',home);

async function check_db() {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
}
check_db();

app.listen(port, () => console.info(`App listening on port ${port}`))