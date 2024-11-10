require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const categoriesRoute = require('./routes/categoriesRoutes');
const coursesRoute = require('./routes/coursesRoutes');

app.use(express.json());

mongoose.connect(process.env.DATABASE_URI).then(result =>{
    const port = process.env.PORT || 3000
    app.listen(port, ()=>{
        console.log("connected to mongoose");
        console.log("app listenning on port 3001");    
    });
}).catch(err=>{
    console.log(err);
});


// 1. categories
app.use('/categories', categoriesRoute);

// 3. courses
app.use('/courses', coursesRoute);


// 7. All Courses details ---- by course_id --Admin

// 8. enabled course details -- user


app.get('/',(req, res)=>{
    res.send("Index page")
})