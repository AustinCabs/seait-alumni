const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;

router.get('/admin-feedback',async (req,res) =>{
    if (req.session.user_id != null) {

        let sql = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at FROM feedbacks f
        inner join  alumnis a  ON  f.from =  a.alumni_id
        WHERE f.from != 1
        group by f.from`
        let data = await sequelize.query(sql, { type: QueryTypes.SELECT });
        // console.log(data);
          let avatar =  req.session.name
          res.render('admin/feedback',{
            avatar : avatar.toUpperCase(),
             user: data,
             ppic : req.session.pic

          });
       } else {
          res.redirect('/');
    
       }
});

router.get('/admin-message/:id',async (req,res) =>{
    if (req.session.user_id != null) {

      
      let sql = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at,DATE_FORMAT(f.created_at,'%d/%m/%Y %h:%i%p') as date_posted FROM feedbacks f
      inner join  alumnis a  ON  f.from =  a.alumni_id
      WHERE f.from = ${req.params.id} AND f.to = 1  OR f.to = ${req.params.id} AND f.from = 1
      ORDER BY created_at ASC`

      let data = await sequelize.query(sql, { type: QueryTypes.SELECT });

      console.log(data);

          let avatar =  req.session.name
          res.render('admin/feedback-message',{
            avatar : avatar.toUpperCase(),
            data:data,
            from : req.params.id
          });
       } else {
          res.redirect('/');
    
       }
});

router.get('/admin-messages/:id',async (req,res) =>{
  try {
   let sql = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at,DATE_FORMAT(f.created_at,'%d/%m/%Y %h:%i%p') as date_posted FROM feedbacks f
   inner join  alumnis a  ON  f.from =  a.alumni_id
   WHERE f.from = ${req.params.id} AND f.to = 1  OR f.to = ${req.params.id} AND f.from = 1
   ORDER BY created_at ASC`

   let data = await sequelize.query(sql, { type: QueryTypes.SELECT });

   res.send({success:true,data:container});
   
} catch (error) {
     res.send({success:false});
  }
});


router.post('/admin-message',async (req,res) =>{
   try {
   
      let {to_id,message} =  req.body;
   
       let sql = `insert into feedbacks (feedbacks.from,message,feedbacks.to) values (1,"${message}",${to_id})`
       const q = await sequelize.query(sql, { type: QueryTypes.INSERT });

       let sql1 = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at,DATE_FORMAT(f.created_at,'%d/%m/%Y %h:%i%p') as date_posted FROM feedbacks f
         inner join  alumnis a  ON  f.from =  a.alumni_id
         WHERE f.from = ${to_id} AND f.to = 1  OR f.to = ${to_id} AND f.from = 1
         ORDER BY created_at ASC`
      
      let data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });

      // let container = [] ;
      let container = "" ;

       data1.forEach(e => {
         
         if (e.from != 1) {

            // let a = `
            container += `
               <div class="direct-chat-msg" >
               <div class="direct-chat-infos clearfix">
               <span class="direct-chat-name float-left"> ${e.fname.toUpperCase()} ${e.lname.toUpperCase()} </span>
               <span class="direct-chat-timestamp float-right">${e.date_posted }</span>
               </div>
               <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=e67e22&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
               <div class="direct-chat-text">
               ${e.message}
               </div>
            </div>
            `;
           // container.push({a});

         }else{
            container += `
            <div class="direct-chat-msg right" >
            <div class="direct-chat-infos clearfix">
              <span class="direct-chat-name float-right">${e.fname.toUpperCase()}</span>
              <span class="direct-chat-timestamp float-left">${e.date_posted}</span>
            </div>
            <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=0D8ABC&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
            <div class="direct-chat-text">
             ${e.message}
            </div>
          </div>`
         //   container.push({a});

         }

       });


       res.send({success:true,data:container})
       
      } catch (e) {
          res.send({success:false,message:e})
         console.log(e);
         // res.send({success:false})
       }
});

router.get('/feedback',async (req,res) =>{
   if (req.session.user_id != null) {

     
     let sql = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at,DATE_FORMAT(f.created_at,'%d/%m/%Y %h:%i%p') as date_posted FROM feedbacks f
     inner join  alumnis a  ON  f.from =  a.alumni_id
     WHERE f.from = ${req.session.user_id} AND f.to = 1  OR f.to = ${req.session.user_id} AND f.from = 1
     ORDER BY created_at ASC`

     let data = await sequelize.query(sql, { type: QueryTypes.SELECT });

     console.log(data);

         let avatar =  req.session.name
         res.render('alumni/feedback-message',{
           avatar : avatar.toUpperCase(),
           data:data,
           ppic : req.session.pic

         });
      } else {
         res.redirect('/');
   
      }
});

router.post('/message',async (req,res) =>{
   try {
   
      let {message} =  req.body;

     
      let sql = `insert into feedbacks (feedbacks.from,message,feedbacks.to) values (${req.session.user_id},"${message}",1)`
       const q = await sequelize.query(sql, { type: QueryTypes.INSERT });

       let sql1 = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at,DATE_FORMAT(f.created_at,'%d/%m/%Y %h:%i%p') as date_posted FROM feedbacks f
         inner join  alumnis a  ON  f.from =  a.alumni_id
         WHERE f.from = ${req.session.user_id} AND f.to = 1  OR f.to = ${req.session.user_id} AND f.from = 1
         ORDER BY created_at ASC`
      
      let data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });

      // let container = [] ;
      let container = "" ;

       data1.forEach(e => {
         
         if (e.from != 1) {

            // let a = `
            container += `
               <div class="direct-chat-msg right" >
               <div class="direct-chat-infos clearfix">
               <span class="direct-chat-name float-right"> ${e.fname.toUpperCase()} ${e.lname.toUpperCase()} </span>
               <span class="direct-chat-timestamp float-left">${e.date_posted }</span>
               </div>
               <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=e67e22&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
               <div class="direct-chat-text">
               ${e.message}
               </div>
            </div>
            `;
           // container.push({a});

         }else{
            container += `
            <div class="direct-chat-msg " >
            <div class="direct-chat-infos clearfix">
              <span class="direct-chat-name float-left">${e.fname.toUpperCase()}</span>
              <span class="direct-chat-timestamp float-right">${e.date_posted}</span>
            </div>
            <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=0D8ABC&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
            <div class="direct-chat-text">
             ${e.message}
            </div>
          </div>`
         //   container.push({a});

         }

       });


       res.send({success:true,data:container})
       
      } catch (e) {
          res.send({success:false,message:e})
         console.log(e);
         // res.send({success:false})
       }
});

router.get('/message-load',async (req,res) =>{
   try {
   

       let sql1 = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at,DATE_FORMAT(f.created_at,'%d/%m/%Y %h:%i%p') as date_posted FROM feedbacks f
         inner join  alumnis a  ON  f.from =  a.alumni_id
         WHERE f.from = ${req.session.user_id} AND f.to = 1  OR f.to = ${req.session.user_id} AND f.from = 1
         ORDER BY created_at ASC`
      
      let data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });

      // let container = [] ;
      let container = "" ;

       data1.forEach(e => {
         
         if (e.from != 1) {

            // let a = `
            container += `
               <div class="direct-chat-msg right" >
               <div class="direct-chat-infos clearfix">
               <span class="direct-chat-name float-right"> ${e.fname.toUpperCase()} ${e.lname.toUpperCase()} </span>
               <span class="direct-chat-timestamp float-left">${e.date_posted }</span>
               </div>
               <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=e67e22&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
               <div class="direct-chat-text">
               ${e.message}
               </div>
            </div>
            `;
           // container.push({a});

         }else{
            container += `
            <div class="direct-chat-msg " >
            <div class="direct-chat-infos clearfix">
              <span class="direct-chat-name float-left">${e.fname.toUpperCase()}</span>
              <span class="direct-chat-timestamp float-right">${e.date_posted}</span>
            </div>
            <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=0D8ABC&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
            <div class="direct-chat-text">
             ${e.message}
            </div>
          </div>`
         //   container.push({a});

         }

       });


       res.send({success:true,data:container})
       
      } catch (e) {
          res.send({success:false,message:e})
         console.log(e);
         // res.send({success:false})
       }
});


router.get('/admin-message-load/:to_id',async (req,res) =>{
   try {
   
      let {to_id} =  req.params;

       let sql1 = `SELECT feedback_id,f.from,f.to,fname,lname,message,f.created_at,DATE_FORMAT(f.created_at,'%d/%m/%Y %h:%i%p') as date_posted FROM feedbacks f
         inner join  alumnis a  ON  f.from =  a.alumni_id
         WHERE f.from = ${to_id} AND f.to = 1  OR f.to = ${to_id} AND f.from = 1
         ORDER BY created_at ASC`
      
      let data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });

      // let container = [] ;
      let container = "" ;

       data1.forEach(e => {
         
         if (e.from != 1) {

            // let a = `
            container += `
               <div class="direct-chat-msg" >
               <div class="direct-chat-infos clearfix">
               <span class="direct-chat-name float-left"> ${e.fname.toUpperCase()} ${e.lname.toUpperCase()} </span>
               <span class="direct-chat-timestamp float-right">${e.date_posted }</span>
               </div>
               <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=e67e22&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
               <div class="direct-chat-text">
               ${e.message}
               </div>
            </div>
            `;
           // container.push({a});

         }else{
            container += `
            <div class="direct-chat-msg right" >
            <div class="direct-chat-infos clearfix">
              <span class="direct-chat-name float-right">${e.fname.toUpperCase()}</span>
              <span class="direct-chat-timestamp float-left">${e.date_posted}</span>
            </div>
            <img class="direct-chat-img" src="https://ui-avatars.com/api/?background=0D8ABC&color=ffff&name=${e.fname.toUpperCase()} ${e.lname.toUpperCase()}&rounded=true" alt="Message User Image">
            <div class="direct-chat-text">
             ${e.message}
            </div>
          </div>`
         //   container.push({a});

         }

       });


       res.send({success:true,data:container})
       
      } catch (e) {
          res.send({success:false,message:e})
         console.log(e);
         // res.send({success:false})
       }
});
module.exports = router;