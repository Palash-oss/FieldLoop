const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({

    organizationId:{
           type:mongoose.Schema.Types.ObjectId,
           ref:'Organization',
           required:true,
           index:true,
       },
       actorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
       },
       action:{
        type:String,
        required:true,//e.g. 'JOB_STATUS_UPDATED', 'INVOICE_SENT', 'USER_ROLE_CHANGED'
       },
       targetType:{
        type:String,
        required:true //JOB INVOICE USER
       },
       targetId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
       }, details: {
    type: mongoose.Schema.Types.Mixed // Flexible metadata object about the change
  }
}, { timestamps: true });
module.exports = mongoose.model('AuditLog', auditLogSchema);