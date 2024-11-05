
const mongoose = require('mongoose');
// _id
// topic
// duration
// enabled
// sortby
// description
// course_details_id

const course_contents_schema = mongoose.Schema({
    _id: Number,
    topic: String,
    duration: Number,
    enabled: Boolean,
    sortby: Number,
    description: String,
    course_detail_id: [
        {
            type: Number,
            ref: 'course_detail'
        }
    ]
});

module.exports = mongoose.model('course_content', course_contents_schema);