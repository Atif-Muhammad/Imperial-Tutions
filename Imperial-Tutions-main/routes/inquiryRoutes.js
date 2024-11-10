const express = require('express');
const router = express.Router();
const inquiryModel = require('../models/inquiryModel') 


// get all inquiries
router.get('/', (req, res)=>{
    res.send("inquiries")
});

// get the inquiry by id
router.get('/inquiry', (req, res)=>{
    const inquiry_id = req.query.id;
});

// create an inquiry--general or course-specific
router.post('/postInquiry', (req, res)=>{
    const course_id = req.query.id;
    if(course_id){
        return res.send("set the inquiry for course")
        
    }else{
        return res.send("set a general inquiry")
    }
});

module.exports = router;