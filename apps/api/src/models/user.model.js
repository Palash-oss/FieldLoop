const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


const userSchema= new mongoose.Schema({
    organizationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Organization',
        required:true,
        index:true,
    },
    name:{
        type:String,
        required:[true,'User name is required'],
        trim:true
    },
    email:{
      type:String,
      required:[true,'Email is required'],
      unique:true,
      lowercase:true,
      trim:true,
      
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        select:false,
    },
    role:{
        type:String,
        enum: [
    'OWNER',         // Business Owner (Full access)
    'MANAGER',       // Operations / Branch Manager
    'DISPATCHER',    // Office Dispatcher (Schedules & assigns jobs)
    'TECHNICIAN',    // Primary Field Technician
    'APPRENTICE',    // Junior / Helper Technician
    'SUBCONTRACTOR', // External Contractor hired for overflow work
    'ACCOUNTANT'     // Billing / Finance clerk
  ],
        default:'TECHNICIAN'
    },
    phone: {
    type: String,
    trim: true
  },
  skills: [{
    type: String
  }],
   isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation:{
    lat:{type:Number},
    lng:{type:Number},
    updatedAt:{type:Date}
  }
    
    
},{timestamps:true})


userSchema.pre('save',async function(next){
  if (!this.isModified('password')) return next();
  this.password= await bcrypt.hash(this.password,10);

})


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User',userSchema);