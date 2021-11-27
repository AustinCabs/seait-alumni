const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;

router.get('/',(req,res) =>{
    
    res.render('');
});

module.exports = router;