const mongoose = require('mongoose')
const course = require('./coursesModel')
// create category schema
const category_schema = mongoose.Schema({
    _id: Number,
    name: String,
    enabled: Boolean,
    sortby: Number,
    description: String,
    courses:[
        {
            type: Number,
            ref: 'course'
        }
    ]
})

module.exports = mongoose.model('category', category_schema);