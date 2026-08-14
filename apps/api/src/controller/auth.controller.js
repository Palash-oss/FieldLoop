const authService = require('../services/auth.service');



class AuthController{
      /**
   * POST /api/v1/auth/register
   * Registers a new Company Organization & Owner User
   */


  async register(req,res){
    try{
        const{orgName,name,email,password}=req.body;
        if(!orgName||!name||!email||!password){
            return res.status(400).json({status: 'fail',
          message: 'Please provide orgName, name, email, and password'});
        }
        const result = await authService.registerOrganization({orgName,name,email,password});
        return res.status(200).json({
             status: 'success',
        message: 'Organization registered successfully',
        data: result
        })
    }
    catch(error){
       return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }


    /**
   * POST /api/v1/auth/login
   * Logs in a User and returns JWT Tokens
   */


    async login(req,res){
        try{
            const{email,password} = req.body;
            if(!email||!password){
                return res.status(400).json({
                    status:'fail',
                    message:'please provide email and password'
                });
            }
            const result = await authService.Login({email,password});

            return res.status(200).json({status:'success',message:'Loged In Successfully',data:result});
        }
        catch (error) {
      return res.status(401).json({
        status: 'fail',
        message: error.message
      });
    }       
    }

}
    module.exports = new AuthController();
    




