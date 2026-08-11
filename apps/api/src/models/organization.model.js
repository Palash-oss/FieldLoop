const monggoose = require('mongoose')
const { timeStamp } = require('node:console')


const organizationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Organization name is required'],
        trim:true
    },
    plan: {
    type: String,
    enum: ['FREE', 'STARTER', 'PRO', 'BUSINESS'],
    default: 'STARTER'
  },
   subscription: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'cancelled'],
      default: 'active'
    },
     stripeCustomerId: {
    type: String,
    default: null
  },
    trialEnd: { type: Date, default: null },
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    stripeCustomerId: { type: String, index: true },
    stripeSubscriptionId: { type: String, index: true },
    stripePriceId: { type: String },
    stripeCurrentPeriodEnd: { type: Date, default: null }
  },

  planDetails: {
    maxUsers: { type: Number, required: true },
    maxProjects: { type: Number, required: true },
    maxReports: { type: Number, required: true },
    features: [String]
  },
   businessHours: {
    start: { type: String, default: '08:00' },
    end: { type: String, default: '17:00' }
  },
  timezone: {
    type: String,
    default: 'UTC'
  }
    
},{timeStamps:true});


module.exports = mongoose.model('Organization',organizationSchema);