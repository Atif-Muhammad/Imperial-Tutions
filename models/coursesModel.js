const mongoose = require('mongoose')
const category = require('./categoriesModel')
const course_detail = require('./courseDetailsModel')

const courses_schema = mongoose.Schema({
    _id: Number,
    name: String,
    enabled: Boolean,
    sortby: Number,
    price: Number,
    description: String,
    rating: Number,
    category_id: {
        type: Number,
        ref: 'category'
    },
    course_details:{
        type: Number,
        ref: 'course_detail'
    }
})

module.exports = mongoose.model('course', courses_schema);