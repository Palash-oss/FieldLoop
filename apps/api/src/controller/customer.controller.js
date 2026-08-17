const CustomerService = require('../services/customer.service');

class CustomerController {
      // POST /api/v1/customers

      async create(req,res){
         try{
          const customer = await CustomerService.createCustomer(req.orgId,req.body);
          return res.status(201).json({
            status:'success',
            message:"Customer Created Successfully",
            data:customer
          })
         }
         catch(error){
            return res.status(400).json({
              status:'fail',
              message:error.message
            })
         }
      }

        // GET /api/v1/customers

        async getALL(req,res){
         try{
            const{search,page,limit}=req.query;
            const result = await CustomerService. getCustomers(req.orgId,{search,page,limit});
            return res.status(200).json({
                status:'Success',
                data:result
            })
         }
         catch(error){
            return res.status(400).json({status:'fail',message:error.message})
         }
        }


         // GET /api/v1/customers/:id
 async getOne(req,res){
    try{
        const customer = await CustomerService .getCustomerById(req.orgId,req.params.id);
        return res.status (200).json({
            status:'success',
            data:customer
        })
    }
    catch(error){
        return res.status(400).json({
            status:'fail',
            message:error.message
        })
    }
 }

// PUT /api/v1/customers/:id


async update(req,res){
    try{
        const customer = await CustomerService.updateCustomer(req.orgId,req.param.id,req.body);
        return res.status (200).json({
            message:'success',
            message:'Customer Updates Successfully',
            data:customer
        })
    }
    catch(error){
        return res.status(400).json({
            status:'fail',
            message:error.message
        })
    }
}

 // DELETE /api/v1/customers/:id

 async delete(req, res) {
    try {
      const result = await customerService.deleteCustomer(req.orgId, req.params.id);
      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}
module.exports = new CustomerController();