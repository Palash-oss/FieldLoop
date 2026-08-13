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
      trime:true,
      
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        select:false,
    },
    role:{
        type:String,
        enum: ['OWNER', 'DISPATCHER', 'TECHNICIAN', 'ACCOUNTANT'],
        default:'USER'
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
    lat:{type:number},
    lng:{type:number},
    updatedAt:{type:Date}
  }
    
    
},{timestamps:true})


userSchema.pre('save',async function(next){
  if (!this.isModified('password')) return next();
  this.password= await bcrypt.hash(this.password,10);
  next();
})


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User',userSchema);