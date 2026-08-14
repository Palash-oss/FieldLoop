const User = require('../models/user.model');
const Organization = require('../models/organization.model');
const jwt = require('jsonwebtoken')


class AuthService{


    async registerOrganization({orgName,name,email,password}){
      //1 : check if user exist
      const existingUser = await User.findOne({email});
      if(existingUser){
        throw new Error('User already Exist');
      }
      // 2 or else create organization
      const organization = await Organization.create({
        name:orgName,
        plan:'STARTER',
        subscriptionStatus:'TRIALING',
      })
  // 3. Create the Owner User linked to the Organization
      const user = await User.create({
       organizationId: organization._id,
       name,
       email,
       password,
       role:'OWNER',
      });
      const tokens  = this.generateTokens(user);
      return{
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            organizationId:user.organizationId,
        },
        organization,
        tokens
      }

    


    }


     //User Login
    async Login({email,password}){
     //1find user and explicitly select password field
     const user  = await User.findOne({email}).select('+password');
     if(!user){
        throw new Error('User does not Exist')
     }


      //comapre password using instanmce method
      const isMatch = await user.comparePassword(password);
      if(!isMatch){
        throw new Error('Invalid Email or Password')
      }
      //Generate jwt tokens
      const tokens = this.generateTokens(user)

      return {
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            organizationId:user.organizationId,
        },
        tokens,
      }
    }




    //Helper function to generate jwt access and refresh tokens
 generateTokens(user){
     const accessToken = jwt.sign(
      { userId: user._id, organizationId: user.organizationId, role: user.role },
      process.env.JWT_SECRET || 'fieldloop_super_secret_jwt_key_2026',
    );
       const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || 'fieldloop_super_secret_refresh_key_2026',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    return { accessToken, refreshToken };
  }
 











}

module.exports = new AuthService();