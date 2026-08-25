const mongoose = require('mongoose')

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
}, { _id: false });

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
        index:true,
    }],
    serviceType:{
        type:String,
        required:[true,'Service type required'],
        trim:true,
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        enum:[
          'REQUESTED',
          'SCHEDULED',
          'EN_ROUTE',
          'IN_PROGRESS',
          'COMPLETED',
          'INVOICED',
          'PAID',
          'CANCELLED',
          'NEEDS_FOLLOWUP'
        ],
        default:'REQUESTED',
        index:true,
    },
    statusHistory: [statusHistorySchema],
    scheduledStart: { type: Date },
    scheduledEnd: { type: Date },
    assignedAt: { type: Date },
    completedDate: { type: Date },
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
        name: String,
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
      type: String
    }]
}, { timestamps: true })

module.exports = mongoose.model('Job', jobSchema);