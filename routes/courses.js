const express = require('express');
const coursesModel = require('../models/coursesModel');
const router = express.Router();

// 1. all courses----- asc or desc
// route: /courses?order=-1
router.get('/', async (req, res)=>{
    const order_val = req.query.order
    const courses = await coursesModel.find({}).sort({sortby: Number(order_val)});
    res.send(courses);
});

// 2. course by id
// route: /courses/course?id=2
router.get('/course', async (req, res)=>{
    const course_id = req.query.id;
    const courses = await coursesModel.findOne({_id: course_id});
    res.send(courses);
});

// 3. All enabled courses --- asc and desc
// route: /courses/course/enabled?order=-1
router.get('/course/enabled', async (req, res)=>{
    const order_val = req.query.order;
    const courses = await coursesModel.find({enabled: true}).sort({sortby: Number(order_val)});
    res.send(courses);
});

// 4. All courses details --- asc and desc
// route: /courses/details?order=-1
router.get('/details', async (req, res)=>{
    const order_val = req.query.order;
    const courses_details = await coursesModel.find({}).populate("course_details").sort({sortby: Number(order_val)});
    res.send(courses_details);
})

// 5. All enabled courses details --- asc and desc
// route: /courses/details/enabled?order=1
router.get('/details/enabled', async (req, res)=>{
    const order_val = req.query.order;
    const courses_details = await coursesModel.find({enabled: true}).populate("course_details").sort({sortby: Number(order_val)});
    res.send(courses_details);
})

// 6. Course details with course id
// route: /courses/details/course?id=1
router.get('/details/course', async (req, res)=>{
    const courses_details = await coursesModel.find({_id: req.query.id}).populate("course_details");
    res.send(courses_details);
})


module.exports = router;