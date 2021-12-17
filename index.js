require('dotenv').config()
const express = require('express');
const app = express();
const port = 5020;
const db  = require('./config');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
// const { Sequelize  } = require('sequelize');
// const db = process.env.ENV != "dev" ? process.env.P_DB : process.env.DB; 
// const user = process.env.ENV != "dev" ? process.env.P_USER : process.env.USER; 
// const pass = process.env.ENV != "dev" ? process.env.P_PASS : process.env.PASS; 
// const sequelize = new Sequelize(db, user, pass, {
//     host: 'localhost',
//     dialect: 'mysql'
//   });
//  console.log(process.env.DB,process.env.USER,process.env.PASS)

app.use(express.static('public'));
app.use(cookieParser());
// Set View's
app.set('views', './public/view');
// app.set('img', './public/yearbook-img');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}));

const home  = require('./routes/index.js');
const yearbook  = require('./routes/yearbook.js');
const user  = require('./routes/user.js');
const job  = require('./routes/job.js');
const feedback  = require('./routes/feedback.js');

app.use('/',home);
app.use('/',yearbook);
app.use('/',user);
app.use('/',job);
app.use('/',feedback);


async function check_db() {
  try {
    const conn = await db.sequelize;
      await conn.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
}
check_db();

app.listen(port, () => console.info(`App listening on port ${port}`))