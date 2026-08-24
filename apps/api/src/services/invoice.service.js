const Invoice = require('../models/invoice.model');
const Job = require('../models/job.model');

class InvoiceService {
  /**
   * Generate Invoice from a completed Job
   */
  async createInvoice(organizationId, { jobId, taxRate = 0 }) {
    // 1. Verify job exists
    const job = await Job.findOne({ _id: jobId, organizationId });
    if (!job) {
      throw new Error('Job not found');
    }

    // 2. Check if invoice already exists for this job
    const existingInvoice = await Invoice.findOne({ jobId, organizationId });
    if (existingInvoice) {
      return existingInvoice;
    }

    // 3. Build line items from partsUsed + priceEstimate
    const lineItems = [];
    let subtotal = job.priceEstimate || 0;

    if (job.priceEstimate > 0) {
      lineItems.push({
        description: `${job.serviceType} Service Fee`,
        quantity: 1,
        unitPrice: job.priceEstimate,
        amount: job.priceEstimate
      });
    }

    if (job.partsUsed && job.partsUsed.length > 0) {
      job.partsUsed.forEach(part => {
        const partAmount = (part.quantity || 1) * (part.unitCost || 0);
        subtotal += partAmount;
        lineItems.push({
          description: part.name,
          quantity: part.quantity || 1,
          unitPrice: part.unitCost || 0,
          amount: partAmount
        });
      });
    }

    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // 4. Create Invoice
    const invoice = await Invoice.create({
      organizationId,
      jobId,
      customerId: job.customerId,
      lineItems,
      subtotal,
      tax,
      total,
      status: 'DRAFT',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Due in 14 days
    });

    // Update job status to INVOICED
    job.status = 'INVOICED';
    await job.save();

    return await invoice.populate('customerId', 'name email phone address');
  }

  /**
   * Get all Invoices for Organization
   */
  async getInvoices(organizationId, { status, page = 1, limit = 10 }) {
    const query = { organizationId };
    if (status) query.status = status.toUpperCase();

    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(query)
      .populate('customerId', 'name email phone')
      .populate('jobId', 'serviceType status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Invoice.countDocuments(query);

    return {
      invoices,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get Single Invoice by ID
   */
  async getInvoiceById(organizationId, invoiceId) {
    const invoice = await Invoice.findOne({ _id: invoiceId, organizationId })
      .populate('customerId')
      .populate('jobId');

    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }

  /**
   * Mark Invoice Status (SENT, PAID, OVERDUE, DISPUTED)
   */
  async updateInvoiceStatus(organizationId, invoiceId, status) {
    const invoice = await Invoice.findOne({ _id: invoiceId, organizationId });
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.status = status;
    if (status === 'PAID') {
      invoice.paidAt = new Date();

      // Also update linked job status to PAID
      const job = await Job.findById(invoice.jobId);
      if (job) {
        job.status = 'PAID';
        await job.save();
      }
    }

    await invoice.save();
    return invoice;
  }
}

module.exports = new InvoiceService();
