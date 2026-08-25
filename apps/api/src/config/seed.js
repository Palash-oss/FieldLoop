const Organization = require('../models/organization.model');
const User = require('../models/user.model');
const Customer = require('../models/customer.model');
const Job = require('../models/job.model');
const Invoice = require('../models/invoice.model');
const bcrypt = require('bcryptjs');

async function seedInitialData() {
  try {
    const orgCount = await Organization.countDocuments();
    if (orgCount > 0) {
      // Check if there are any jobs, if not, seed jobs
      const jobCount = await Job.countDocuments();
      if (jobCount === 0) {
        const org = await Organization.findOne();
        const tech = await User.findOne({ role: 'TECHNICIAN' });
        const cust = await Customer.findOne();
        if (org && cust) {
          await Job.create([
            {
              organizationId: org._id,
              customerId: cust._id,
              assignedTechnicians: tech ? [tech._id] : [],
              serviceType: 'Commercial HVAC Diagnostic & Calibration',
              description: 'Routine quarterly maintenance and main compressor pressure test.',
              status: 'EN_ROUTE',
              priority: 'HIGH',
              priceEstimate: 450,
              address: { street: '1244 Market St', city: 'San Francisco', state: 'CA', zip: '94102', lat: 37.7749, lng: -122.4194 },
            },
            {
              organizationId: org._id,
              customerId: cust._id,
              assignedTechnicians: tech ? [tech._id] : [],
              serviceType: '200A Electrical Panel Upgrade',
              description: 'Replace main breaker panel and verify ground wiring.',
              status: 'IN_PROGRESS',
              priority: 'URGENT',
              priceEstimate: 1200,
              address: { street: '450 Sutter St', city: 'San Francisco', state: 'CA', zip: '94108', lat: 37.7892, lng: -122.4081 },
            },
            {
              organizationId: org._id,
              customerId: cust._id,
              assignedTechnicians: [],
              serviceType: 'Main Line Leak Emergency Repair',
              description: 'Burst pipe flooding basement utility room.',
              status: 'REQUESTED',
              priority: 'URGENT',
              priceEstimate: 350,
              address: { street: '88 Colin P Kelly Jr St', city: 'San Francisco', state: 'CA', zip: '94107', lat: 37.7813, lng: -122.3918 },
            },
            {
              organizationId: org._id,
              customerId: cust._id,
              assignedTechnicians: tech ? [tech._id] : [],
              serviceType: 'Quarterly Drain Cleaning & Jetting',
              description: 'Hydro-jet kitchen stack lines for commercial restaurant.',
              status: 'COMPLETED',
              priority: 'MEDIUM',
              priceEstimate: 550,
              completedDate: new Date(),
              address: { street: '201 Mission St', city: 'San Francisco', state: 'CA', zip: '94105', lat: 37.7915, lng: -122.3965 },
            },
          ]);
          console.log('✅ Seeded initial work orders!');
        }
      }
      return;
    }

    console.log('🌱 Seeding initial organization, staff, customers, and jobs...');

    // 1. Create Organization
    const org = await Organization.create({
      name: 'Apex Plumbing & Field Services',
      slug: 'apex-plumbing',
      timezone: 'America/Los_Angeles',
    });

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // 2. Create Users
    const owner = await User.create({
      organizationId: org._id,
      name: 'Xian Li',
      email: 'xianli@gmail.com',
      password: hashedPassword,
      role: 'OWNER',
    });

    const tech1 = await User.create({
      organizationId: org._id,
      name: 'Mike Torres',
      email: 'mike@apexplumbing.com',
      password: hashedPassword,
      role: 'TECHNICIAN',
      phone: '(415) 890-1234',
      currentLocation: { lat: 37.7749, lng: -122.4194, updatedAt: new Date(), status: 'EN_ROUTE' },
    });

    const tech2 = await User.create({
      organizationId: org._id,
      name: 'Alex Rivera',
      email: 'alex@apexplumbing.com',
      password: hashedPassword,
      role: 'TECHNICIAN',
      phone: '(415) 901-2345',
      currentLocation: { lat: 37.7892, lng: -122.4081, updatedAt: new Date(), status: 'IN_PROGRESS' },
    });

    const tech3 = await User.create({
      organizationId: org._id,
      name: 'Sarah Jenkins',
      email: 'sarah@apexplumbing.com',
      password: hashedPassword,
      role: 'TECHNICIAN',
      phone: '(415) 789-0123',
      currentLocation: { lat: 37.7813, lng: -122.3918, updatedAt: new Date(), status: 'IDLE' },
    });

    // 3. Create Customers
    const cust1 = await Customer.create({
      organizationId: org._id,
      name: 'Acme Commercial Properties',
      email: 'facility@acme.com',
      phone: '(415) 555-0192',
      address: { street: '1244 Market St', city: 'San Francisco', state: 'CA', zip: '94102', lat: 37.7749, lng: -122.4194 },
    });

    const cust2 = await Customer.create({
      organizationId: org._id,
      name: 'Metro Health Clinic',
      email: 'ops@metrohealth.org',
      phone: '(415) 555-0843',
      address: { street: '450 Sutter St', city: 'San Francisco', state: 'CA', zip: '94108', lat: 37.7892, lng: -122.4081 },
    });

    const cust3 = await Customer.create({
      organizationId: org._id,
      name: 'Bayview Apartments',
      email: 'mgmt@bayviewapts.com',
      phone: '(415) 555-0471',
      address: { street: '88 Colin P Kelly Jr St', city: 'San Francisco', state: 'CA', zip: '94107', lat: 37.7813, lng: -122.3918 },
    });

    // 4. Create Jobs
    const j1 = await Job.create({
      organizationId: org._id,
      customerId: cust1._id,
      assignedTechnicians: [tech1._id],
      serviceType: 'Commercial HVAC Diagnostic & Calibration',
      description: 'Routine quarterly maintenance and main compressor pressure test.',
      status: 'EN_ROUTE',
      priority: 'HIGH',
      priceEstimate: 450,
      scheduledStart: new Date(),
      address: cust1.address,
    });

    const j2 = await Job.create({
      organizationId: org._id,
      customerId: cust2._id,
      assignedTechnicians: [tech2._id],
      serviceType: '200A Electrical Panel Upgrade',
      description: 'Replace main breaker panel and verify ground wiring.',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      priceEstimate: 1200,
      scheduledStart: new Date(),
      address: cust2.address,
    });

    const j3 = await Job.create({
      organizationId: org._id,
      customerId: cust3._id,
      assignedTechnicians: [],
      serviceType: 'Main Line Leak Emergency Repair',
      description: 'Burst pipe flooding basement utility room.',
      status: 'REQUESTED',
      priority: 'URGENT',
      priceEstimate: 350,
      scheduledStart: new Date(),
      address: cust3.address,
    });

    const j4 = await Job.create({
      organizationId: org._id,
      customerId: cust1._id,
      assignedTechnicians: [tech3._id],
      serviceType: 'Quarterly Drain Cleaning & Jetting',
      description: 'Hydro-jet kitchen stack lines for commercial restaurant.',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      priceEstimate: 550,
      completedDate: new Date(),
      address: cust1.address,
    });

    // 5. Create Invoices
    await Invoice.create([
      {
        organizationId: org._id,
        customerId: cust1._id,
        jobId: j4._id,
        amount: 550,
        status: 'PAID',
        lineItems: [{ description: 'Quarterly Hydro-Jet Drain Cleaning', amount: 550, quantity: 1 }],
      },
      {
        organizationId: org._id,
        customerId: cust2._id,
        jobId: j2._id,
        amount: 1200,
        status: 'DRAFT',
        lineItems: [{ description: '200A Commercial Panel Replacement', amount: 1200, quantity: 1 }],
      },
    ]);

    console.log('✅ Fieldloop initial data successfully seeded!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

module.exports = seedInitialData;
