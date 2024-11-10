require('dotenv').config();
const express = require("express");
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const categoriesRoute = require('./routes/categoriesRoutes');
const coursesRoute = require('./routes/coursesRoutes');
const inquiryRoute = require('./routes/inquiryRoutes');

app.use(express.json());
app.use(cors());

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

// 2. courses
app.use('/courses', coursesRoute);

// 3.  inquiries
app.use('/inquiry', inquiryRoute);


app.get('/',(req, res)=>{
    res.send("Index page")
})