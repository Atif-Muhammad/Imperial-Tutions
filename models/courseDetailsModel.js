const mongoose = require('mongoose');
const course = require('./coursesModel');

const course_details_schema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    prerequisites: Array,
    duration: Number,
    course_includes: Array,
    enabled_flag: Boolean,
    sort_value: Number,
    // course_contents: [
    //     {
    //         type: Number,
    //         ref: 'course_contents'
    //     }
    // ]

})

module.exports = mongoose.model('course_detail', course_details_schema);