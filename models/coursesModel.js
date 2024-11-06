const mongoose = require('mongoose')
const category = require('./categoriesModel')
const course_detail = require('./courseDetailsModel')

const courses_schema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    course_name: String,
    enabled_flag: Boolean,
    sort_value: Number,
    price: Number,
    course_description: String,
    rating: Number,
    course_level: String,
    course_duration: Number, 
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
    // course_details:{
    //     type: Number,
    //     ref: 'course_detail'
    // }
})

module.exports = mongoose.model('course', courses_schema);