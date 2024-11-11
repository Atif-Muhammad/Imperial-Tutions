const express = require('express');
const router = express.Router();
const inquiryModel = require('../models/inquiryModel') 
const coursesModel = require('../models/coursesModel')

// get all inquiries
router.get('/', (req, res)=>{
    res.send("inquiries")
});

// get the inquiry by id
router.get('/inquiry', (req, res)=>{
    const inquiry_id = req.query.id;
});

// create an inquiry--general or course-specific
router.post('/postInquiry', async (req, res)=>{
    const course_id = req.query.course_id;
    if(course_id){
        // return res.send("set the inquiry for course")
        const inq_details = {
            inquiry_by: req.query.name,
            email: req.query.email,
            replied_flag: req.query.replied,
            viewed_flag: req.query.viewed,
            for_course: req.query.course_id,
            inquiry: req.query.message
        }
       try {
            const added_inq = await inquiryModel.create(inq_details).exec();
            try {
                const updated_course = await coursesModel.updateOne({_id: course_id}, {$push: {inquiries: added_inq._id}}).exec();
                res.send(updated_course);
            } catch (error) {
                res.send(error)
            }
       } catch (error) {
            res.send(error);
       } 
    }else{
        const inq_details = {
            inquiry_by: req.query.name,
            email: req.query.email,
            replied_flag: req.query.replied,
            viewed_flag: req.query.viewed
        }
    }
});

module.exports = router;