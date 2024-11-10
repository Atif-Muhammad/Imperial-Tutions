const express = require('express');
const router = express.Router();
const inquiryModel = require('../models/inquiryModel') 

router.get('/', (req, res)=>{

    const course_id = req.query.id;
    if(course_id){
        return res.send("set the inquiry for course")
        
    }else{
        return res.send("set a general inquiry")
    }
});


module.exports = router;