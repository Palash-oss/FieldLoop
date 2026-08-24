const Job = require('../models/job.model');
const Customer = require('../models/customer.model');
const User = require('../models/user.model');

class JobService {
  /**
   * Create and Dispatch a Job
   */
  async createJob(organizationId, jobData) {
    // 1. Verify that the Customer exists in this organization
    const customer = await Customer.findOne({ _id: jobData.customerId, organizationId });
    if (!customer) {
      throw new Error('Invalid customer ID for this organization');
    }

    // 2. If technicians are assigned, verify they exist & belong to this organization
    if (jobData.assignedTechnicians && jobData.assignedTechnicians.length > 0) {
      const techCount = await User.countDocuments({
        _id: { $in: jobData.assignedTechnicians },
        organizationId
      });
      if (techCount !== jobData.assignedTechnicians.length) {
        throw new Error('One or more assigned technicians are invalid or belong to another organization');
      }
    }

    // 3. Create the Job in MongoDB
    const job = await Job.create({
      organizationId,
      ...jobData,
      status: jobData.assignedTechnicians?.length > 0 ? 'SCHEDULED' : 'REQUESTED'
    });

    // 4. Replace customer ID with actual Customer details before returning
    return await job.populate('customerId', 'name phone address');
  }

  /**
   * Get all Jobs for Organization with Status & Date Filters
   */
  async getJobs(organizationId, { status, technicianId, startDate, endDate, page = 1, limit = 10 }) {
    const query = { organizationId };

    if (status) {
      query.status = status.toUpperCase();
    }

    if (technicianId) {
      query.assignedTechnicians = technicianId;
    }

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
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get Technician's Assigned Jobs (Mobile App View)
   */
  async getMyJobs(organizationId, technicianId) {
    const jobs = await Job.find({
      organizationId,
      assignedTechnicians: technicianId,
      status: { $ne: 'CANCELLED' }
    })
      .populate('customerId', 'name phone address')
      .sort({ scheduledStart: 1 });

    return jobs;
  }

  /**
   * Get Single Job Details
   */
  async getJobById(organizationId, jobId) {
    const job = await Job.findOne({ _id: jobId, organizationId })
      .populate('customerId')
      .populate('assignedTechnicians', 'name phone role skills');

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  /**
   * Update Job Status (State Machine Transition: EN_ROUTE -> IN_PROGRESS -> COMPLETED)
   */
  async updateJobStatus(organizationId, jobId, status, { partsUsed, signatureUrl, photos }) {
    const job = await Job.findOne({ _id: jobId, organizationId });
    if (!job) {
      throw new Error('Job not found');
    }

    const validStatuses = ['REQUESTED', 'SCHEDULED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'INVOICED', 'PAID', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid job status');
    }

    job.status = status;

    if (partsUsed) job.partsUsed = partsUsed;
    if (signatureUrl) job.signatureUrl = signatureUrl;
    if (photos) job.photos = photos;

    await job.save();
    return job;
  }

  /**
   * Update Job Schedule or Details
   */
  async updateJob(organizationId, jobId, updateData) {
    const job = await Job.findOneAndUpdate(
      { _id: jobId, organizationId },
      updateData,
      { new: true, runValidators: true }
    ).populate('customerId').populate('assignedTechnicians', 'name phone');

    if (!job) {
      throw new Error('Job not found or access denied');
    }

    return job;
  }

  /**
   * Delete / Cancel Job
   */
  async deleteJob(organizationId, jobId) {
    const job = await Job.findOneAndDelete({ _id: jobId, organizationId });
    if (!job) {
      throw new Error('Job not found or access denied');
    }
    return { message: 'Job deleted successfully' };
  }
}

module.exports = new JobService();
