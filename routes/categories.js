const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const categoriesModel = require('../models/categoriesModel');


// 1. all categories---ascending with sortby                         ✔
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

// 2. category by id                                                 ✔  
// route: /categories/category?id=2
router.get('/category', async (req, res)=>{
    try {
        const category = await categoriesModel.findOne({_id: req.query.id});
        res.send(category)
    } catch (error) {
        res.send(error)
    }
});

// 3. enabled categories                                             ✔
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

// 4. All courses of the requested category                          ✔
// courses are ascending or descending order
// route: /categories/category/courses?id=1&order=-1
router.get('/category/courses', async (req, res)=>{
    const order_val = req.query.order;
    try {
        const cat_courses = await categoriesModel.aggregate([
            {$match: {_id: Number(req.query.id)}},
            {$lookup: {
                from: 'courses', // name of the collection to join
                localField: 'courses',
                foreignField: '_id',
                as: 'course_details' //output array containing all fields
            }},{
                $unwind: "$course_details"
            },{
                $sort: {"course_details.sortby": Number(order_val)}
            },{
                $group: {
                    _id: "$_id",
                    name: {$first: "$name"},
                    enabled: {$first: "$enabled"},
                    description: { $first: "$description" },
                    sortby: { $first: "$sortby" },
                    courses: { $push: "$course_details" } 
                }
            }
        ])
        res.send(cat_courses)
    }catch (error) {
        res.send(error);
    }
});

// 5. enabled courses of the requested category                      ✔
// courses in ascending or descending
// route: /categories/category/courses/enabled?id=1&order=1
router.get('/category/courses/enabled', async (req, res)=>{
    try {
        const cat_courses = await categoriesModel.aggregate([
            {$match: {_id: Number(req.query.id)}},
            {$lookup: {
                from: 'courses', // name of the collection to join
                localField: 'courses',
                foreignField: '_id',
                as: 'course_details' //output array containing all fields
            }},{
                $unwind: "$course_details"
            },{
                $sort: {"course_details.sortby": Number(req.query.order)}
            },{
                $match: {"course_details.enabled": true}
            },{
                $group: {
                    _id: "$_id",
                    name: {$first: "$name"},
                    enabled: {$first: "$enabled"},
                    description: { $first: "$description" },
                    sortby: { $first: "$sortby" },
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