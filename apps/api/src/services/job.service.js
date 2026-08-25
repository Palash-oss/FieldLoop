const Job = require('../models/job.model');
const Customer = require('../models/customer.model');
const User = require('../models/user.model');
const { validateTransition, createHistoryEntry } = require('./job.statemachine');

class JobService {
  /**
   * Create and Dispatch a Job
   */
  async createJob(organizationId, jobData, userId) {
    // 1. Verify customer belongs to this org
    const customer = await Customer.findOne({ _id: jobData.customerId, organizationId });
    if (!customer) {
      throw new Error('Invalid customer ID for this organization');
    }

    // 2. Verify assigned technicians belong to this org
    if (jobData.assignedTechnicians && jobData.assignedTechnicians.length > 0) {
      const techCount = await User.countDocuments({
        _id: { $in: jobData.assignedTechnicians },
        organizationId
      });
      if (techCount !== jobData.assignedTechnicians.length) {
        throw new Error('One or more technicians are invalid or belong to another organization');
      }
    }

    // 3. Determine initial status
    const initialStatus = jobData.assignedTechnicians?.length > 0 ? 'SCHEDULED' : 'REQUESTED';

    // 4. Create with initial status history entry
    const job = await Job.create({
      organizationId,
      ...jobData,
      status: initialStatus,
      assignedAt: initialStatus === 'SCHEDULED' ? new Date() : undefined,
      statusHistory: [createHistoryEntry(initialStatus, userId)],
    });

    return await job.populate([
      { path: 'customerId', select: 'name phone address' },
      { path: 'assignedTechnicians', select: 'name phone role' },
    ]);
  }

  /**
   * Get all Jobs for Organization with filters
   */
  async getJobs(organizationId, { status, technicianId, startDate, endDate, page = 1, limit = 10 }) {
    const query = { organizationId };

    if (status) query.status = status.toUpperCase();
    if (technicianId) query.assignedTechnicians = technicianId;

    if (startDate || endDate) {
      query.scheduledStart = {};
      if (startDate) query.scheduledStart.$gte = new Date(startDate);
      if (endDate) query.scheduledStart.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('customerId', 'name phone address')
      .populate('assignedTechnicians', 'name phone role')
      .sort({ scheduledStart: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    return {
      jobs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    };
  }

  /**
   * Get Technician's Assigned Jobs (Mobile App)
   */
  async getMyJobs(organizationId, technicianId) {
    return await Job.find({
      organizationId,
      assignedTechnicians: technicianId,
      status: { $nin: ['CANCELLED', 'PAID'] }
    })
      .populate('customerId', 'name phone address')
      .sort({ scheduledStart: 1 });
  }

  /**
   * Get Single Job
   */
  async getJobById(organizationId, jobId) {
    const job = await Job.findOne({ _id: jobId, organizationId })
      .populate('customerId')
      .populate('assignedTechnicians', 'name phone role skills');

    if (!job) throw new Error('Job not found');
    return job;
  }

  /**
   * Transition Job Status — uses state machine for validation
   * @param {string} organizationId
   * @param {string} jobId
   * @param {string} newStatus
   * @param {string} userId - who is making the change
   * @param {object} extras - { partsUsed, signatureUrl, photos, note }
   */
  async transitionJobStatus(organizationId, jobId, newStatus, userId, extras = {}) {
    const job = await Job.findOne({ _id: jobId, organizationId });
    if (!job) throw new Error('Job not found');

    // Validate transition via state machine
    const { valid, message } = validateTransition(job.status, newStatus);
    if (!valid) {
      throw new Error(message);
    }

    // Apply transition
    job.status = newStatus;
    job.statusHistory.push(createHistoryEntry(newStatus, userId, extras.note));

    // Side-effects based on new status
    if (newStatus === 'COMPLETED') {
      job.completedDate = new Date();
    }
    if (newStatus === 'SCHEDULED' && !job.assignedAt) {
      job.assignedAt = new Date();
    }

    // Optional field updates on completion
    if (extras.partsUsed) job.partsUsed = extras.partsUsed;
    if (extras.signatureUrl) job.signatureUrl = extras.signatureUrl;
    if (extras.photos) job.photos = extras.photos;

    await job.save();

    return await job.populate([
      { path: 'customerId', select: 'name phone address' },
      { path: 'assignedTechnicians', select: 'name phone role' },
    ]);
  }

  /**
   * Update Job Details (schedule, description, technicians, etc.)
   */
  async updateJob(organizationId, jobId, updateData) {
    const job = await Job.findOneAndUpdate(
      { _id: jobId, organizationId },
      updateData,
      { new: true, runValidators: true }
    ).populate('customerId').populate('assignedTechnicians', 'name phone');

    if (!job) throw new Error('Job not found or access denied');
    return job;
  }

  /**
   * Delete Job
   */
  async deleteJob(organizationId, jobId) {
    const job = await Job.findOneAndDelete({ _id: jobId, organizationId });
    if (!job) throw new Error('Job not found or access denied');
    return { message: 'Job deleted successfully' };
  }
}

module.exports = new JobService();
