const Customer = require('../models/customer.model');

class CustomerService{
  /**
   * Create a new Customer for the Organization
   */

  async createCustomer (organizationId, customerData){
      // 1. Check if customer with same phone already exists in this organization

      if(customerData.phone){
        const exisitng = await Customer.findOne({organizationId,phone:customerData.phone});
        if(exisitng){
            throw new Error ('A customer with this Phone number already exists')
        }
      }

      //Create customer linked to tenant organization
      const customer  = await Customer.create({
        organizationId,
        ...customerData,
      })

      return customer;
  }



  async getCustomers(organizationId,{search,page=1,limit=10}){
    const query = {organizationId};
 // Line 2: If the user typed a search term (e.g. "smith" or "555-0199")
    if(search){
    query.$or=[
        {name:{$regex:search,$options:'i'}},
        {phone:{$regex:search,$options:'i'}}
    ]
    }

    // Line 3: Calculate how many documents to skip for Pagination
     const skip = (page - 1) * limit;

     // Line 4: Fetch matching customers from MongoDB
     const customers = await Customer.find(query)
     .sort({createdAt: -1})
     .skip(skip)
     .limit(Number(limit))

 // Line 5: Count total total matching records in database
 const total = await Customer.countDocuments(query);
 // Line 6: Return customers list + pagination info
  return {
    customers,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    }
  }

}
 /**
   * Get Single Customer by ID
   */


 async getCustomerById(organizationId, customerId){
const customer = await Customer.findOne({ _id: customerId, organizationId });
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }



    /**
   * Update Customer
   */
  async updateCustomer(organizationId, customerId, updateData) {
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId, organizationId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  /**
   * Delete Customer (Soft Delete)
   */
  async deleteCustomer(organizationId, customerId) {
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId, organizationId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

}