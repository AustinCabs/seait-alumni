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

            let data_courses = {}
            const courses = await sequelize.query("SELECT * FROM courses ", { type: QueryTypes.SELECT });
            
            let year = new Date().getFullYear();
            let arr_year = [];
            for (let index = 2005; index < year; index++) {
                arr_year.push(index);
            }
            arr_year.push(year);
            data.courses = courses;
            data.years = arr_year;

            res.render('admin/user',{
                avatar : avatar.toUpperCase(),
                data:data,
                courses:courses,
                years:arr_year
            });
    
        } catch (e) {
            console.log(` error : 20 ${e}`);
            res.send({success:false,message:`${e}`})
        }
     
    }else{
        res.redirect('/');
    }
});

router.get('/users/:id', async(req,res) =>{
        try {
            let sql = `select * from alumnis where alumni_id = ${req.params.id}`
            const q = await sequelize.query(sql, { type: QueryTypes.SELECT });
            console.log(q)
             
            return  res.send(q[0])

        } catch (e) {
            console.log(`error : ${e}`);
        }
})

router.put('/users/:id',async(req,res) => {
     try {
         let {
            user_id,
            fname,
            mname,
            lname,
            bday,
            phone,
            year,
            gender,
            course,
            job_status
         } = req.body

        let sql = `update alumnis set fname="${fname}" ,mname="${mname}", lname="${lname}", bday='${bday}' ,gender="${gender}" , phone_num="${phone}", year_graduated="${year}", course_id=${course}, job_status="${job_status}" where alumni_id = ${user_id}`
        const q = await sequelize.query(sql, { type: QueryTypes.UPDATE });
        console.log(q)
        res.send({success:true})
    } catch (e) {
        console.log(e)
        res.send({success:false,message:e})
        
     }
})

router.delete('/users/:id',async(req,res) => {
    try {
        let sql = `delete  from alumnis where alumni_id = ${req.params.id}`
        const q = await sequelize.query(sql, { type: QueryTypes.DELETE });
        console.log(q)

        let sql1 = `delete  from users where alumni_id = ${req.params.id}`
        const q1 = await sequelize.query(sql1, { type: QueryTypes.DELETE });
        console.log(q1)

         res.send({success:true})
         
        } catch (e) {
            console.log(e);
            res.send({success:false,message:e})
            
}
})



module.exports = router;