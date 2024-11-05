const mongoose = require('mongoose');
const course = require('./coursesModel');

const course_details_schema = mongoose.Schema({
    _id: Number,
    course_id: {
        type: Number,
        ref: 'course'
    },
    prerequisites: Array,
    duration: Number,
    course_includes: Array,
    course_contents: [
        {
            type: Number,
            ref: 'course_contents'
        }
    ]

})

module.exports = mongoose.model('course_detail', course_details_schema);