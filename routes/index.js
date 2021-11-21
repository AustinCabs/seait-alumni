const express = require('express');
const router  = express.Router();

router.get('/',(req,res) => {
    res.render('alumni/login');
 });

router.get('/yearbook',(req,res) => {
    res.render('alumni/yearbook');
 });

router.get('/yearbook-detail',(req,res) => {
    res.render('alumni/yearbook-details');
 });


router.get('/date',(req,res) => {
    
    let year = new Date().getFullYear();
    let arr_year = [];
    for (let index = 2000; index < year; index++) {
         arr_year.push(index);
    }
    arr_year.push(year);
    res.send({years:arr_year});
 });

 module.exports = router;