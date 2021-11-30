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
      res.redirect('/');

   }
});

router.get('/yearbook-detail',(req,res) => {
   res.render('alumni/yearbook-details');
});

router.get('/manage-yearbooks',async(req,res) => {

if (req.session.user_id != null) {
   try {

      const courses = await sequelize.query("SELECT * FROM courses ", { type: QueryTypes.SELECT });
      let  sql  = `select year_graduated,yearbook_id,course_name 
      from yearbooks
      inner join courses on yearbooks.course_id = courses.course_id`
      const data = await sequelize.query(sql, { type: QueryTypes.SELECT });
      
      let year = new Date().getFullYear();
      let arr_year = [];
      for (let index = 2005; index < year; index++) {
           arr_year.push(index);
      }
      arr_year.push(year);

      let avatar =  req.session.name
      res.render('admin/manage-yearbook',{
         yearbooks:data,
         courses:courses,  
         years:arr_year,
         avatar : avatar.toUpperCase()
      });
      
   } catch (e) {
      console.log(e);
      res.send({success:false})
   }

} else {
   res.redirect('/');

}
 
});

router.post('/manage-yearbooks',async(req,res) => {
    try {
   
   let {year,course} =  req.body;

    let sql = `insert into yearbooks (course_id,year_graduated) values (${course},"${year}")`
    const q = await sequelize.query(sql, { type: QueryTypes.INSERT });
    res.send({success:true})

    } catch (e) {
      console.log(e);
      res.send({success:false})
    }
})

 


 module.exports = router;