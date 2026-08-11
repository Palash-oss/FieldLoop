const mongoose = require('mongoose')


const connectDB = async() =>{
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB CONNECTED");
  }
  catch(err){
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
  }
}


module.exports = connectDB;