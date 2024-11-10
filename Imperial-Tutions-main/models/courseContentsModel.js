
const mongoose = require('mongoose');

const course_contents_schema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    topic: String,
    duration: Number,
    enabled_flag: Boolean,
    sort_value: Number,
    content_description: String,
    course_detail_id: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course_detail'
    }
    
});

module.exports = mongoose.model('course_content', course_contents_schema);