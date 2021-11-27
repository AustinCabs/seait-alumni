const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;

router.get('/user', async(req,res) =>{
    if (req.session.user_id != null) {

        try {
            let q2 = `Select CONCAT(alumnis.fname," ",alumnis.mname," ",alumnis.lname) as name,email,phone_num,
            TIMESTAMPDIFF(YEAR, bday, CURDATE()) AS age, bday ,gender , year_graduated,job_status,alumnis.alumni_id,courses.course_name,
            users.username
            from alumnis
            inner join courses on alumnis.course_id = courses.course_id
            inner join  users on alumnis.alumni_id  = users.alumni_id`
            const data = await sequelize.query(q2, { type: QueryTypes.SELECT })
            let avatar =  req.session.name
            //  console.log(data);
            res.render('admin/user',{
                avatar : avatar.toUpperCase(),
                data:data
            });
    
        } catch (e) {
            console.log(` error : 20 ${e}`);
            res.send({success:false,message:`${e}`})
        }
     
    }else{
        res.redirect('/');
    }
});


module.exports = router;