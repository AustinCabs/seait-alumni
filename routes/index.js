const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;

router.get('/',async (req,res) => {
    let data = {}
    const courses = await sequelize.query("SELECT * FROM courses ", { type: QueryTypes.SELECT });
    
    let year = new Date().getFullYear();
    let arr_year = [];
    for (let index = 2005; index < year; index++) {
         arr_year.push(index);
    }
    arr_year.push(year);
    data.courses = courses;
    data.years = arr_year;
    // console.log(data);

    res.render('alumni/login',{
         courses:courses,
         years:arr_year
    });
 });

 router.post('/register', async (req,res) => {
//     console.log(req.body);
     try {
          // let year = `${req.body.year}-00-00`
          let val = `"${req.body.fname}","${req.body.mname}","${req.body.lname}",'${req.body.bday}',"${req.body.phone}",'${req.body.year}',"${req.body.gender}",${req.body.course},"${req.body.job_status}","${req.body.email_register}"`;
          let q = `insert into alumnis  (fname,mname,lname,bday,phone_num,year_graduated,gender,course_id,job_status,email) values (${val})`
          const [result,meta] = await sequelize.query(q, { type: QueryTypes.INSERT })
          //  console.log(`result 34 : ${result}`);
          //  console.log(`meta 34: ${meta}`);
          //result == last inserted id
           let val2 = `"","${req.body.email_register}","${req.body.password}",${result}`
           let q2 = `insert into users  (device_id,username,password,alumni_id) values (${val2})`
           const [result1,meta1] = await sequelize.query(q2, { type: QueryTypes.INSERT })
          //  console.log(`result 40 : ${result1}`);
          //  console.log(`meta 41: ${meta1}`);

           res.send({success:true});   

     } catch (e) {
      console.log(`error 39 : ${e}`);   
      res.send({success:false});       
     }
 });

 router.get('/dates',(req,res) =>{
     let year = new Date().getFullYear();
     let arr_year = [];
     for (let index = 2005; index < year; index++) {
          arr_year.push(index);
     }
     arr_year.push(year);
     res.send(arr_year);
 });

 
 router.post('/verify', async (req,res) =>{
    try {
     let q = `select * from users where username = "${req.body.email}" and password = "${req.body.password}"`
     const query = await sequelize.query(q, { type: QueryTypes.SELECT })
     // console.log(query);
     // console.log(query[0].user_id);
     // console.log(query[0].username);
     if (query.length != 0) {
          // console.log("true");
          //  res.redirect("/yearbook");
          // res.render('alumni/yearbook');
          req.session.user_id = query[0].user_id
          req.session.role_id =  (query[0].username == "admin@admin") ? 1 : 0;
          let q1 = `select * from alumnis where alumni_id = ${query[0].alumni_id}`
          const query1 = await sequelize.query(q1, { type: QueryTypes.SELECT })
          req.session.name =  (query[0].username == "admin@admin") ? "Admin" : `${query1[0].fname} ${query1[0].lname}` 
          // console.log(req.session);
          if (req.session.role_id  == 1) {             
               res.send({success:true,url:"/user"});   
          } else {
               res.send({success:true,url:"/yearbook"});   
          }

     } else {
          // console.log("false");
          res.send({success:false,message:"Account not yet registered"});   
     }               
    } catch (e) {
      console.log(`error 66 : ${e}`);
     res.send({success:false});   
    }
 });

router.get('/logout',(res,req) =>{
     res.session.destroy();
     res.redirect('/');
});

 


 module.exports = router;