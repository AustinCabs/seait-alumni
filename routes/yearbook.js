const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;

// var app = express()

// async function roles (req, res, next) {
//    if (req.session.user_id != null  ) {
//       next()
//    } else {
//       let data = {}
//       const courses = await sequelize.query("SELECT * FROM courses ", { type: QueryTypes.SELECT });
      
//       let year = new Date().getFullYear();
//       let arr_year = [];
//       for (let index = 2005; index < year; index++) {
//            arr_year.push(index);
//       }
//       arr_year.push(year);
//       data.courses = courses;
//       data.years = arr_year;
//       // console.log(data);
  
//       res.render('alumni/login',{
//            courses:courses,
//            years:arr_year
//       });       
//    }
//  }


//  app.use(roles)


router.get('/yearbook',async(req,res) => {
   if (req.session.user_id != null) {

      let avatar =  req.session.name
      res.render('alumni/yearbook',{
         avatar : avatar.toUpperCase()
      });
   } else {
    
   // let data = {}
   // const courses = await sequelize.query("SELECT * FROM courses ", { type: QueryTypes.SELECT });
   
   // let year = new Date().getFullYear();
   // let arr_year = [];
   // for (let index = 2005; index < year; index++) {
   //      arr_year.push(index);
   // }
   // arr_year.push(year);
   // data.courses = courses;
   // data.years = arr_year;
   // // console.log(data);

   // res.render('alumni/login',{
   //      courses:courses,
   //      years:arr_year
   // });

   res.redirect('/');

   }
});

router.get('/yearbook-detail',(req,res) => {
   res.render('alumni/yearbook-details');
});


 module.exports = router;