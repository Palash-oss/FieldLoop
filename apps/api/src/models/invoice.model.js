const mongoose  =require('mongoose')

const invoiceSchema = new mongoose .Schema({
    organizationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Organization',
        required:true,
        index:true,
    },
    jobId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Job',
         required: true,
    unique: true,

    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
         ref:'Job',
         required: true,
    

    },
    lineItems:[{
        description:{
            type:String,
            required:true,
        
        },
        quantity:{
            type:Number,
            required:true,
            default:1,
        },
       unitPrice: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 }, // quantity * 

        }
    ],
    subtotal:{
        type:Number,
        required:true,
        deafult:0,
    },
    tax:{
        type:Number,
        deafult:0,
    },
    total:{
        type:Number,
        required:true,
        deafult:0,
    },
    status:{
        type:String,
        enum:['DRAFT','SENT','PAID','OVERDUE','DISPUTED'],
        default:'DRAFT',
    }, stripePaymentIntentId: {
    type: String
  },
  dueDate: {
    type: Date
  },
  paidAt: {
    type: Date
  }

},{timestamps:true});


module.exports = mongoose.model('Invoice',invoiceSchema);