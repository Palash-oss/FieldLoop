const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    organizationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Organization',
        required:true,
        index:true
    },
    name:{
        type:String,
        required:[true,'Customer name is required'],
        trim:true,
    },
    email:{
        type:String,
        required:[true,'Customer email is required'],
        unique:true,
        lowercase:true,
        trim:true,
    },
    
    phone:{
        type:String,
        required:[true,'Customer phone is required'],
        trim:true,
    },

    address:{
         street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
        
    },
    notes:{
        type:String,
        trim:true,
    },

    tags:{
        type:[String],
    },
    totalJobs:{
        type:Number,
        default:0,
    }
   
},{timestamps:true})

module.exports = mongoose.model('Customer',customerSchema);