const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;
const path = require("path")
var multer  = require('multer')



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


router.get('/admin-yearbook',async(req,res) => {
   if (req.session.user_id != null) {

      // let sql1 = `SELECT  distinct year_graduated  FROM yearbooks`
      // const years = await sequelize.query(sql1, { type: QueryTypes.SELECT });

      let sql2 = `SELECT * FROM yearbooks yb
                  inner join courses c  on yb.course_id = c.course_id`
      const courses = await sequelize.query(sql2, { type: QueryTypes.SELECT });
      // console.log(years);
      // console.log(courses);

      let avatar =  req.session.name
      res.render('admin/yearbook',{
         avatar : avatar.toUpperCase(),
         courses:courses,
         // years:years
      });
   } else {
      res.redirect('/');

   }
});

router.get('/yearbook',async(req,res) => {
   if (req.session.user_id != null) {

      // let sql1 = `SELECT  distinct year_graduated  FROM yearbooks`
      // const years = await sequelize.query(sql1, { type: QueryTypes.SELECT });

      let sql2 = `SELECT * FROM yearbooks yb
                  inner join courses c  on yb.course_id = c.course_id`
      const courses = await sequelize.query(sql2, { type: QueryTypes.SELECT });
      // console.log(years);
      // console.log(courses);

      let avatar =  req.session.name
      res.render('alumni/yearbook',{
         avatar : avatar.toUpperCase(),
         courses:courses,
         ppic : req.session.pic
         // years:years
      });
   } else {
      res.redirect('/');

   }
});

router.get('/admin-yearbook-detail/:id', async(req,res) => {

   if (req.session.user_id != null) {

      let sql2 = `SELECT * FROM yearbooks yb
                  inner join courses c  on yb.course_id = c.course_id WHERE yearbook_id = ${req.params.id}`
      const desc = await sequelize.query(sql2, { type: QueryTypes.SELECT });

      let sql3 = `SELECT * FROM yearbook_pics WHERE yearbook_id = ${req.params.id}`
      const pics = await sequelize.query(sql3, { type: QueryTypes.SELECT });

       console.log(desc);
       console.log(pics);
      let avatar =  req.session.name
      res.render('admin/yearbook-details',{
         avatar : avatar.toUpperCase(),
         year : desc[0].year_graduated,
         course :desc[0].course_name,
         pic : pics
      });
   } else {
      res.redirect('/');

   }

});

router.get('/yearbook-detail/:id', async(req,res) => {

   if (req.session.user_id != null) {

      let sql2 = `SELECT * FROM yearbooks yb
                  inner join courses c  on yb.course_id = c.course_id WHERE yearbook_id = ${req.params.id}`
      const desc = await sequelize.query(sql2, { type: QueryTypes.SELECT });

      let sql3 = `SELECT * FROM yearbook_pics WHERE yearbook_id = ${req.params.id}`
      const pics = await sequelize.query(sql3, { type: QueryTypes.SELECT });

       console.log(desc);
       console.log(pics);
      let avatar =  req.session.name
      res.render('alumni/yearbook-details',{
         avatar : avatar.toUpperCase(),
         year : desc[0].year_graduated,
         course :desc[0].course_name,
         pic : pics,
         ppic : req.session.pic
      });
   } else {
      res.redirect('/');

   }

});

router.get('/manage-yearbook-detail/:id', async(req,res) => {
   if (req.session.user_id != null) {
      try {
         let {id} =  req.params;
         let sql = `select course_name,year_graduated  from yearbooks
         inner join courses on yearbooks.course_id = courses.course_id
         where yearbook_id = ${id}`
         const data = await sequelize.query(sql, { type: QueryTypes.SELECT });

         let sql1 = `SELECT * FROM yearbook_pics WHERE yearbook_id = ${id}`
         const data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });

         let arr_data = [];
         // let counter = 0 ;
         data1.forEach(e => {
            
           let img =  (e.is_img_path) ?  `/img/${e.pic_path}`:  `/yearbook-img/${e.pic_path}`
           let name   = e.fullname
           let yearbook_id = e.yearbook_id
           let yearbook_pics = e.yearbook_pics
           arr_data.push({img,name,yearbook_id,yearbook_pics});
            // console.log(e);
            // counter++;
          });

         //  console.log(arr_data);
         //  console.log(data1);
         let avatar =  req.session.name
         res.render('admin/manage-yearbook-detail',{
            avatar:avatar.toUpperCase(),
            course:data[0].course_name,
            year_graduated:data[0].year_graduated,
            id : id,
            table : arr_data,
            ppic : req.session.pic

         });

      } catch (e) {
         console.log(e);
         res.send({success:false})
      }
   }else{
      res.redirect('/');
   }
});

let  nameFile;
const storage = multer.diskStorage({
    destination:`./public/yearbook-img`,
    filename:(req,file,cb) => {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`;
        nameFile = fileName;
        cb(null,fileName)
    }
})

const upload = multer({ storage }).single('pic')

router.post('/manage-yearbook-detail', upload,async(req,res) => {
   let  {fullname,id} = req.body;
   //  console.log(req.body);
   //  console.log(req.params);
   //  console.log(req.file);
   //  console.log(req.body.fullname);
   //  console.log(req.body.id);
   // let path = `public/yearbook-img/`
   try {
      let sql = `insert into yearbook_pics (pic_path,yearbook_id,fullname) values ("${nameFile}",${id},"${fullname}")`
      let data = await sequelize.query(sql, { type: QueryTypes.INSERT });
      res.send({success:true})
      
   } catch (e) {
      console.log(e);
      res.send({success:false})
   }
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


router.delete('/manage-yearbook-detail/:id',async(req,res) => {

   try {
      let sql = `DELETE FROM yearbook_pics WHERE yearbook_pics = ${req.params.id}`
      let data = await sequelize.query(sql, { type: QueryTypes.DELETE });
      res.send({success:true})
      
   } catch (e) {
      console.log(e);
      res.send({success:false})
   }
});
 

router.delete('/manage-yearbooks/:id',async(req,res) => {

   try {
      let sql = `DELETE FROM yearbooks WHERE yearbook_id = ${req.params.id}`
      let data = await sequelize.query(sql, { type: QueryTypes.DELETE });
      res.send({success:true})
      
   } catch (e) {
      console.log(e);
      res.send({success:false})
   }
});
 


 module.exports = router;