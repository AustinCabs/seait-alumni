const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;

// router.get('/job',async(req,res) =>{
//     if (req.session.user_id != null) {

      
  
//         let avatar =  req.session.name
//         res.render('admin/admin-job',{
//            avatar : avatar.toUpperCase()
//         });
//      } else {
//         res.redirect('/');
  
//      }
// });

router.get('/manage-job',async(req,res) =>{
    if (req.session.user_id != null) {

      let sql1 = `SELECT * FROM jobs`
      const data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });
  
        let avatar =  req.session.name
        res.render('admin/manage-job',{
          avatar : avatar.toUpperCase(),
          job:data1

        });
     } else {
        res.redirect('/');
  
     }
});

router.get('/admin-job',async(req,res) =>{
    if (req.session.user_id != null) {

      let sql1 = `SELECT * FROM jobs`
      const data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });
  
        let avatar =  req.session.name
        res.render('admin/admin-job',{
          avatar : avatar.toUpperCase(),
          job:data1

        });
     } else {
        res.redirect('/');
  
     }
});

router.get('/job',async(req,res) =>{
    if (req.session.user_id != null) {

      let sql1 = `SELECT * FROM jobs`
      const data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });
  
        let avatar =  req.session.name
        res.render('alumni/job',{
          avatar : avatar.toUpperCase(),
          job:data1

        });
     } else {
        res.redirect('/');
  
     }
});

router.post('/manage-job',async(req,res) =>{
    let  {title,desc,contact} = req.body;
    try {
       let sql = `insert into jobs (title,job_desc,contact) values ("${title}","${desc}","${contact}")`
       let data = await sequelize.query(sql, { type: QueryTypes.INSERT });
       res.send({success:true})
       
    } catch (e) {
       console.log(e);
       res.send({success:false})
    }
});

router.delete('/manage-job/:id',async(req,res) => {

   try {
      let sql = `DELETE FROM jobs WHERE job_id = ${req.params.id}`
      let data = await sequelize.query(sql, { type: QueryTypes.DELETE });
      res.send({success:true})
      
   } catch (e) {
      console.log(e);
      res.send({success:false})
   }
});

module.exports = router;