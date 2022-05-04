const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Registration').then(()=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log(err);
})
