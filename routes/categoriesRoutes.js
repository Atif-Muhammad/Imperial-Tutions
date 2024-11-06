const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const categoriesModel = require('../models/categoriesModel');
const coursesModel = require('../models/coursesModel')


// admin
// 1. add category                                                     ✔
router.post('/addCategory', async (req, res)=>{
    // destructure filed values from request
    const cat_values = {
        category_name: req.query.name,
        enabled_flag: req.query.enabled,
        sort_value: req.query.sortValue,
        category_description: req.query.description
    };
    try {
        const added_category = await categoriesModel.create(cat_values)
        res.send(added_category)
    } catch (error) {
        res.send(error)
    }

});

// 2. delete category by id
router.delete('/category/delCategory', async (req, res)=>{
    const cat_id = new mongoose.Types.ObjectId(req.query.id);
    try {
        const deleted = await categoriesModel.deleteOne({_id: cat_id}).exec();
        res.send("deleted", deleted)
    } catch (error) {
        res.send(error);
    }
});

// Admin
// 3. All courses of the requested category                          ✔
// courses are ascending or descending order
// route: /categories/category/courses?id=1&order=-1
router.get('/category/courses', async (req, res)=>{
    const order_val = req.query.order;
    const category_id = new mongoose.Types.ObjectId(req.query.id);
    try {
        const cat_courses = await categoriesModel.aggregate([
            {$match: {_id: category_id}},
            {$lookup: {
                from: 'courses', // name of the collection to join
                localField: 'courses',
                foreignField: '_id',
                as: 'course_details' //output array containing all fields
            }},{
                $unwind: "$course_details"
            },{
                $sort: {"course_details.sort_value": Number(order_val)}
            },{
                $group: {
                    _id: "$_id",
                    category_name: {$first: "$category_name"},
                    enabled_flag: {$first: "$enabled_flag"},
                    category_description: { $first: "$category_description" },
                    sort_value: { $first: "$sort_value" },
                    courses: { $push: "$course_details" } 
                }
            }
        ])
        res.send(cat_courses)
    }catch (error) {
        res.send(error);
    }
});

// Admin/Client
// 4. all categories---ascending with sortby                         ✔
// route: /categories?order=-1 -----> (-1 desc & 1 asc)
router.get('/', async (req, res)=>{
    const order_val = req.query.order;
    try {
        const categories = await categoriesModel.find({}).sort({sortby: Number(order_val)});
        res.send(categories)     
    } catch (error) {
        res.send(error)
    }
});
// Client
// 5. category by id                                                 ✔  
// route: /categories/category?id=2
router.get('/category', async (req, res)=>{
    try {
        const category = await categoriesModel.findOne({_id: req.query.id});
        res.send(category)
    } catch (error) {
        res.send(error)
    }
});
// Client
// 6. enabled categories                                             ✔
// route: /categories/enabled?order=1 -----> (-1 desc & 1 asc)
router.get('/enabled', async (req, res)=>{     
    const order_val = req.query.order;                       
    try {
        const enabled_categories = await categoriesModel.find({enabled: true}).sort({sortby: Number(order_val)});
        res.send(enabled_categories);
    } catch (error) {
        res.send(error)
    }
});

// Client
// 7. enabled courses of the requested category                      ✔
// courses in ascending or descending
// route: /categories/category/courses/enabled?id=1&order=1
router.get('/category/courses/enabled', async (req, res)=>{
    const category_id = new mongoose.Types.ObjectId(req.query.id);
    try {
        const cat_courses = await categoriesModel.aggregate([
            {$match: {_id: category_id}},
            {$lookup: {
                from: 'courses', // name of the collection to join
                localField: 'courses',
                foreignField: '_id',
                as: 'course_details' //output array containing all fields
            }},{
                $unwind: "$course_details"
            },{
                $sort: {"course_details.sort_value": Number(req.query.order)}
            },{
                $match: {"course_details.enabled_flag": true}
            },{
                $group: {
                    _id: "$_id",
                    category_name: {$first: "$category_name"},
                    enabled_flag: {$first: "$enabled_flag"},
                    category_description: { $first: "$category_description" },
                    sort_value: { $first: "$sort_value" },
                    courses: { $push: "$course_details" } 
                }
            }
        ])
        res.send(cat_courses)
    }catch (error) {
        res.send(error);
    }
});









module.exports = router;