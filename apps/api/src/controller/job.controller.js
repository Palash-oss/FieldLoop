const jobService = require('../services/job.service');

class JobController {
  // POST /api/v1/jobs (Create & Dispatch Job)
  async create(req, res) {
    try {
      const job = await jobService.createJob(req.orgId, req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // GET /api/v1/jobs (All Jobs for Dispatcher/Owner)
  async getAll(req, res) {
    try {
      const { status, technicianId, startDate, endDate, page, limit } = req.query;
      const result = await jobService.getJobs(req.orgId, { status, technicianId, startDate, endDate, page, limit });
      return res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // GET /api/v1/jobs/my-jobs (Technician Mobile View)
  async getMyJobs(req, res) {
    try {
      const jobs = await jobService.getMyJobs(req.orgId, req.user.userId);
      return res.status(200).json({
        status: 'success',
        results: jobs.length,
        data: jobs
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // GET /api/v1/jobs/:id
  async getOne(req, res) {
    try {
      const job = await jobService.getJobById(req.orgId, req.params.id);
      return res.status(200).json({
        status: 'success',
        data: job
      });
    } catch (error) {
      return res.status(404).json({ status: 'fail', message: error.message });
    }
  }

  // PATCH /api/v1/jobs/:id/status (Update Job Status)
  async updateStatus(req, res) {
    try {
      const { status, partsUsed, signatureUrl, photos } = req.body;
      if (!status) {
        return res.status(400).json({ status: 'fail', message: 'Please provide status' });
      }
      const job = await jobService.updateJobStatus(req.orgId, req.params.id, status, { partsUsed, signatureUrl, photos });
      return res.status(200).json({
        status: 'success',
        message: `Job status updated to ${status}`,
        data: job
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // PUT /api/v1/jobs/:id (Update Job Details/Schedule)
  async update(req, res) {
    try {
      const job = await jobService.updateJob(req.orgId, req.params.id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Job updated successfully',
        data: job
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // DELETE /api/v1/jobs/:id
  async delete(req, res) {
    try {
      const result = await jobService.deleteJob(req.orgId, req.params.id);
      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}

module.exports = new JobController();
