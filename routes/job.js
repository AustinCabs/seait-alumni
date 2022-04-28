const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;
const axios = require('axios');
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

      let sql1 = `SELECT *, convert_tz(created_at,'+00:00','+08:00') as posted_at FROM jobs`
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

      let sql1 = `SELECT *,convert_tz(created_at,'+00:00','+08:00') as posted_at FROM jobs`
      const data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });
  
        let avatar =  req.session.name
        res.render('alumni/job',{
          avatar : avatar.toUpperCase(),
          job:data1,
          ppic : req.session.pic


        });
     } else {
        res.redirect('/');
  
     }
});

router.post('/manage-job',async(req,res) =>{
    let  {title,desc,contact,company} = req.body;
    try {
       let sql = `insert into jobs (title,company,job_desc,contact) values ("${title}","${company}","${desc}","${contact}")`
       let data = await sequelize.query(sql, { type: QueryTypes.INSERT });

       let q = `SELECT device FROM devices`
       const query = await sequelize.query(q, { type: QueryTypes.SELECT })

      //  console.log(query);

       let arr_token = []

       query.forEach(e => {
         arr_token.push(e.device)
       })
      //  console.log(arr_token);

       const message = {
            to: arr_token,
            sound: 'default',
            title: 'New Job Posted',
            body: `${title} job has been posted view on app for more info`
          };
       
       let config = {
            headers: {
                 Accept: 'application/json',
                 'Accept-encoding': 'gzip, deflate',
                 'Content-Type': 'application/json',
            }
          }

     let axios_result = await axios.post("https://exp.host/--/api/v2/push/send",JSON.stringify(message),config)
     res.send({success:true})
       
    } catch (e) {
       res.send({success:false})
       console.log(e);
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