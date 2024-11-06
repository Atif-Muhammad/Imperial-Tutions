const express = require('express');
const coursesModel = require('../models/coursesModel');
const categoriesModel = require('../models/categoriesModel');
const router = express.Router();


// 1. add course
router.post('/addCourse', async (req, res)=>{
    const course_details = {
        course_name: req.query.name,
        enabled_flag: req.query.enabled,
        sort_value: req.query.sortValue,
        price: req.query.price,
        course_description: req.query.description,
        rating: req.query.rating,
        course_level: req.query.course_level,
        course_duration: req.query.duration,
        // category_id from client form --- from selected menu item's id
        category_id: req.query.category_id
    }

   try {
        const added_course = await coursesModel.create(course_details);
        // update the courses field in category for id
        try {
            const category = await categoriesModel.updateOne({_id: req.query.category_id}, {$push: {courses: added_course._id}});
        } catch (error) {
            res.send(error)
        }
        res.send(added_course)
   } catch (error) {
        res.send(error)
   }

});

// 2. delete course
router.delete('/course/delCourse', async (req, res)=>{
    const course_id = req.query.id;
    try {
        const deleted = await coursesModel.deleteOne({_id: course_id}).exec();
        if(deleted){
            await categoriesModel.updateOne({courses: course_id}, {$pull: {courses: course_id}}).exec();
            res.send("deleted", deleted)
        }
    } catch (error) {
        res.send(error);
    }
});

// 3. all courses----- asc or desc
// route: /courses?order=-1
router.get('/', async (req, res)=>{
    const order_val = req.query.order
    try {
        const courses = await coursesModel.find({}).sort({sortby: Number(order_val)});
        res.send(courses);
    } catch (error) {
        res.send(error)
    }
});

// 4. course by id
// route: /courses/course?id=2
router.get('/course', async (req, res)=>{
    const course_id = req.query.id;
    try {
        const courses = await coursesModel.findOne({_id: course_id});
        res.send(courses);
    } catch (error) {
        res.send(error)
    }
});

// 5. All enabled courses --- asc and desc
// route: /courses/course/enabled?order=-1
router.get('/course/enabled', async (req, res)=>{
    const order_val = req.query.order;
    try {
        const courses = await coursesModel.find({enabled: true}).sort({sortby: Number(order_val)});
        res.send(courses);
    } catch (error) {
        res.send(error)
    }
});

// 6. All courses details --- asc and desc
// route: /courses/details?order=-1
router.get('/details', async (req, res)=>{
    const order_val = req.query.order;
    try {
        const courses_details = await coursesModel.find({}).populate("course_details").sort({sortby: Number(order_val)});
        res.send(courses_details);
    } catch (error) {
        res.send(error)
    }
})

// 7. All enabled courses details --- asc and desc
// route: /courses/details/enabled?order=1
router.get('/details/enabled', async (req, res)=>{
    const order_val = req.query.order;
    try {
        const courses_details = await coursesModel.find({enabled: true}).populate("course_details").sort({sortby: Number(order_val)});
        res.send(courses_details);
    } catch (error) {
        res.send(error)
    }
})

// 8. Course details with course id
// route: /courses/details/course?id=1
router.get('/details/course', async (req, res)=>{
    const course_id = req.query.id;
    try {
        const courses_details = await coursesModel.find({_id: course_id}).populate("course_details");
        res.send(courses_details);
    } catch (error) {
        res.send(error)
    }
})


module.exports = router;