const invoiceService = require('../services/invoice.service');

class InvoiceController {
  // POST /api/v1/invoices (Generate Invoice from Job)
  async create(req, res) {
    try {
      const { jobId, taxRate } = req.body;
      if (!jobId) {
        return res.status(400).json({ status: 'fail', message: 'Please provide jobId' });
      }
      const invoice = await invoiceService.createInvoice(req.orgId, { jobId, taxRate });
      return res.status(201).json({
        status: 'success',
        message: 'Invoice created successfully',
        data: invoice
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // GET /api/v1/invoices
  async getAll(req, res) {
    try {
      const { status, page, limit } = req.query;
      const result = await invoiceService.getInvoices(req.orgId, { status, page, limit });
      return res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // GET /api/v1/invoices/:id
  async getOne(req, res) {
    try {
      const invoice = await invoiceService.getInvoiceById(req.orgId, req.params.id);
      return res.status(200).json({
        status: 'success',
        data: invoice
      });
    } catch (error) {
      return res.status(404).json({ status: 'fail', message: error.message });
    }
  }

  // PATCH /api/v1/invoices/:id/status
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ status: 'fail', message: 'Please provide status' });
      }
      const invoice = await invoiceService.updateInvoiceStatus(req.orgId, req.params.id, status);
      return res.status(200).json({
        status: 'success',
        message: `Invoice marked as ${status}`,
        data: invoice
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}

module.exports = new InvoiceController();
