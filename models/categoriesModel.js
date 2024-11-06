const mongoose = require('mongoose')
const course = require('./coursesModel')
// create category schema
const category_schema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: ()=> new mongoose.Types.ObjectId()
    },
    category_name: String,
    enabled_flag: Boolean,
    sort_value: Number,
    category_description: String,
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course'
        }
    ]
})

module.exports = mongoose.model('category', category_schema);