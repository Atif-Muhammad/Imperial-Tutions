const express = require('express');
const coursesModel = require('../models/coursesModel');
const categoriesModel = require('../models/categoriesModel');
const courseDetailsModel = require('../models/courseDetailsModel');
const courseContentsModel = require('../models/courseContentsModel');
const { populate } = require('dotenv');
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
            res.send({"deleted": deleted})
        }
    } catch (error) {
        res.send(error);
    }
});


// update course
router.put('/course/update', async (req, res) => {
    const id_of_update = req.body._id;
    const updated_data = {
        course_name: req.body.course_name,
        enabled_flag: req.body.enabled_flag,
        sort_value: req.body.sort_value,
        price: req.body.price,
        course_description: req.body.course_description,
        rating: req.body.rating,
        course_level: req.body.course_level,
        course_duration: req.body.course_duration,
        category_id: req.body.category_id
    };
    
    try {
        const updated = await coursesModel.updateOne({_id: id_of_update}, updated_data).exec();
        // update the courses field in category model
        await categoriesModel.findOne({courses: id_of_update}, {$pull: {courses: id_of_update}}).exec();
        try {
            await categoriesModel.updateOne({_id: updated_data.category_id}, {$push: {courses: id_of_update}}).exec();
            res.send(updated);
        } catch (error) {
            res.send(error);
        }
    } catch (error) {
        res.send(error)
    }
        
});


// 3. all courses----- asc or desc
// route: /courses?order=-1
router.get('/', async (req, res)=>{
    const order_val = req.query.order
    try {
        const courses = await coursesModel.find({}).populate('category_id', "category_name").sort({sort_value: Number(order_val)});
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
router.get('/enabled', async (req, res)=>{
    const order_val = req.query.order;
    try {
        const courses = await coursesModel.find({enabled_flag: true}).populate('category_id', 'category_name').sort({sort_value: Number(order_val)});
        res.send(courses);
    } catch (error) {
        res.send(error)
    }
});

// 6. All courses details --- asc and desc
// route: /courses/details?order=-1
router.get('/details', async (req, res)=>{
    const order_val = req.query.order;
    const cat_id = req.query.id;
    try {
        if(cat_id){
            const courses_details = await coursesModel.find({category_id: cat_id}).populate({path: "course_details", populate:{path: "course_contents"}}).populate("category_id", "category_name").sort({sort_value: Number(order_val)});
            return res.send(courses_details);
        }else{
            const courses_details = await coursesModel.find({}).populate({path: "course_details", populate:{path: "course_contents"}}).populate("category_id", "category_name").sort({sort_value: Number(order_val)});
            return res.send(courses_details);
        }
    } catch (error) {
        res.send(error)
    }
})

// 7. All enabled courses details --- asc and desc
// route: /courses/details/enabled?order=1
router.get('/enabled/details', async (req, res)=>{
    const order_val = req.query.order;
    try {
        const courses_details = await coursesModel.find({enabled_flag: true}).populate({path: "course_details", populate:{path: "course_contents"}}).populate("category_id", "category_name").sort({sort_value: Number(order_val)});
        res.send(courses_details);
    } catch (error) {
        res.send(error)
    }
})

// 8. Course details with course id
// route: /courses/details/course?id=1
router.get('/course/details', async (req, res)=>{
    const course_id = req.query.id;
    try {
        const courses_details = await coursesModel.findOne({_id: course_id}).populate({path: "course_details", populate:{path: "course_contents"}}).populate("category_id", "category_name").exec();
        // const course_details = await coursesModel
        res.send(courses_details);
    } catch (error) {
        res.send(error)
    }
})

// 9. post course details
router.post('/course/addDetails', async (req, res)=>{
    const course_detailss = {
        course_id: req.query.id,
        prerequisites: req.query.prerequisites,
        duration: req.query.duration,
        course_includes: req.query.course_includes,
        enabled_flag: req.query.enabled,
        sort_value: req.query.sortValue
    };
    try {
        const detail_created = await courseDetailsModel.create(course_detailss);
        try {
            const updated_course = await coursesModel.updateOne({_id: course_detailss.course_id}, {course_details: detail_created._id});
            res.send({"details added": updated_course});
        } catch (error) {
            res.send(error);
        }
    } catch (error) {
        res.send(error);
    } 
});
router.post('/course/addContent', async (req, res)=>{
    const course_contents = {
        course_detail_id: req.query.id,
        topic: req.query.topic,
        duration: req.query.duration,
        enabled_flag: req.query.enabled,
        sort_value: req.query.sortValue,
        content_description: req.query.description
    };
    try {
        const content_created = await courseContentsModel.create(course_contents);
        try {
            const updated_course_detail = await courseDetailsModel.updateOne({_id: course_contents.course_detail_id}, {$push:{course_contents: content_created._id}});
            res.send({"content added": updated_course_detail});
        } catch (error) {
            res.send(error);
        }
    } catch (error) {
        res.send(error);
    } 
});

// 10.delete course details
router.delete('/course/delDetails', async (req, res)=>{
    const course_details_id = req.query.id;
    try {
        const deleted = await courseDetailsModel.deleteOne({_id: course_details_id}).exec();
        // remove id from related course document
        console.log(deleted)
        const removed_id = await coursesModel.updateOne({course_details: course_details_id}, {$set: {course_details: null}});
        res.send(removed_id);
    } catch (error) {
        res.send(error)
    }

});




module.exports = router;