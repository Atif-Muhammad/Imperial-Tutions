const mongoose = require('mongoose');
const coursesModel = require('./coursesModel')

const inquiry_schema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    inquiry_by: String,
    email: String,
    inquiry: String,
    replied_flag: {
        type: Boolean,
        default: false
    },
    viewed_flag: {
        type: Boolean,
        default: false
   },
    for_course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }
})

module.exports = mongoose.model('inquiry', inquiry_schema);