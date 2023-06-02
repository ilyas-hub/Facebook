const mongoose=require("mongoose")
require("dotenv").config()

exports.connect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
      useNewUrlparser:true,
      useUnifiedTopology:true,
    }).then(()=>{console.log('DATABASE Connected Successfully')})
    .catch((error)=>{
        console.log(error);
        console.log("DATABASE Connection Filed")
    })
}