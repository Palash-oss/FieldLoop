const mongoose = require('mongoose')




const jobSchema = new mongoose.Schema({
    organizationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Organization',
        required:true,
        index:true
    },
    
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true,
        index:true,
    },
    assignedTechnicians:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    }],
    serviceType:{
        type:String,
        required:[true,'Service type required (eg. Plumbing, HVAC, Repair'],
        trim:true,
    },
    description:{
        type:String,
    },
    //job cycle when to keep paid no paid cancel
    status:{
        type:String,
        enum:[  'REQUESTED',   // Customer requested service
      'SCHEDULED',   // Assigned to calendar & technician
      'EN_ROUTE',    // Technician travelling to site
      'IN_PROGRESS', // Technician working on-site
      'COMPLETED',   // Job done
      'INVOICED',    // Invoice generated
      'PAID',        // Customer paid
      'CANCELLED'    // Cancelled
      ],
        default:'REQUESTED',
        index:true,
    },
      scheduledStart: {
    type: Date
  },
  scheduledEnd: {
    type: Date
  },
   address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    lat: Number,
    lng: Number
  },
  priceEstimate:{
    type:Number,
    default:0,
  },
  partsUsed:[
    {
        name:String,
          quantity: { type: Number, default: 1 },
    unitCost: { type: Number, default: 0 },
    }
  ],
  priority:{
    type:String,
    enum:['LOW','MEDIUM','HIGH','URGENT'],
    default:'MEDIUM',
    index:true,
  },
  signatureUrl:{
    type:String,
  },
  photos: [{
    type: String // URLs of before/after photos uploaded by technician
  }]
    
}, { timestamps: true })


module.exports = mongoose.model('Job',jobSchema);