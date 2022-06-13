const express = require('express');
const router  = express.Router();
const db  = require('../config');
const sequelize =  db.sequelize;
const QueryTypes =  db.QueryTypes;
const path = require("path")
var multer  = require('multer')


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
            let sql = `select * from alumnis a
             inner join users u ON u.alumni_id = a.alumni_id
            where a.alumni_id = ${req.params.id}`
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

let  nameFile;
const storage = multer.diskStorage({
    destination:`./public/img`,
    filename:(req,file,cb) => {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`;
        nameFile = fileName;
        cb(null,fileName)
    }
})


const upload = multer({ storage }).single('profile_pic')
const upload2 = multer({ storage }).single('yearbook_pic')

router.put('/yearbookpic/:id',upload2,async(req,res) => {
    try {
        
        let sql = `select * from alumnis 
        where alumni_id = ${req.params.id}`
        const q = await sequelize.query(sql, { type: QueryTypes.SELECT });
        console.log(q[0]);
        let mname  =  q[0].mname != "" ? q[0].mname.substring(0,1).toUpperCase() + "." : "" 

        const yearbookPicExist = await sequelize.query(`SELECT count(*) as count from yearbook_pics where created_by = ${req.session.alumni_id}`, { type: QueryTypes.SELECT });
        // console.log(yearbookPicExist[0].count);
        if (yearbookPicExist[0].count >= 1) {
            const yearbookPicUpdate = await sequelize.query(`update yearbook_pics SET pic_path='${nameFile}' where created_by = ${req.session.alumni_id}`, { type: QueryTypes.UPDATE });
            console.log(yearbookPicUpdate);
            const yearbookPicNameUpdate = await sequelize.query(`update yearbook_pics SET fullname='${q[0].fname} ${mname} ${q[0].lname}' where created_by = ${req.session.alumni_id}`, { type: QueryTypes.UPDATE });
            console.log(yearbookPicNameUpdate);

        }else{
            
            const checkYearbooks = await sequelize.query(`select count(*) as num, yearbook_id from yearbooks where course_id = ${q[0].course_id} AND year_graduated = ${q[0].year_graduated}`, { type: QueryTypes.SELECT });
             console.log(checkYearbooks);
            if (checkYearbooks[0].num >= 1) {
                const  newYearbookPic = await sequelize.query(`insert into yearbook_pics (pic_path,	yearbook_id,fullname,created_by,is_img_path) values 
                ('${nameFile}',${checkYearbooks[0].yearbook_id},'${q[0].fname} ${mname} ${q[0].lname}',${req.params.id},1)`, { type: QueryTypes.INSERT });
                
            }else{
                 const  newYearbook = await sequelize.query(`insert into yearbooks (course_id,year_graduated) values (${q[0].course_id} , ${q[0].year_graduated})`, { type: QueryTypes.INSERT });
                 console.log(newYearbook);
                if (newYearbook) {
                     
                    const  newYearbookPic = await sequelize.query(`insert into yearbook_pics (pic_path,	yearbook_id,fullname,created_by,is_img_path) values 
                    ('${nameFile}',${newYearbook[0]},'${q[0].fname} ${mname} ${q[0].lname}',${req.params.id},1)`, { type: QueryTypes.INSERT });
                }
             }

        }   
        
       // return  res.send(q[0])

        

       return res.send({success:true})

    } catch (e) {
        console.log(`error : ${e}`);
    }
    
})

router.put('/editInfo/:id',upload,async(req,res) => {
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
            job_status,
            password
            // profile_pic
         } = req.body


         if(!nameFile){
             let sql1 = `SELECT * FROM alumnis WHERE alumni_id = ${user_id}`
             const data1 = await sequelize.query(sql1, { type: QueryTypes.SELECT });
             nameFile = data1[0].profile_pic
             req.session.pic = nameFile
        }

        let sql = `update alumnis set profile_pic = "${nameFile}" , fname="${fname}" ,mname="${mname}", lname="${lname}", bday='${bday}' ,gender="${gender}" , phone_num="${phone}", year_graduated="${year}", course_id=${course}, job_status="${job_status}" where alumni_id = ${user_id}`
        const q = await sequelize.query(sql, { type: QueryTypes.UPDATE });
        req.session.name = `${fname} ${lname}`
        if (password) {
            let sql1 = `update users set password = "${password}" where  alumni_id = ${user_id}`
            const q1 = await sequelize.query(sql1, { type: QueryTypes.UPDATE });
            console.log(q1)
        }

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