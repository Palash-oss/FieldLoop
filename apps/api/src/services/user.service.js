const { update } = require('../controller/customer.controller');
const User = require('../models/user.model')


class UserService{
 /**
   * Add a new Staff Member to the Organization
   */

 async createUser(organizationId,userData){
      // Line 1: Check if email is already taken across the platform
    const exisitngUser = await User.findOne({email:userData.email});
    if(exisitingUser){
        throw new Error('User with this email already exists')
    }
     // Line 2: Create User linked to THIS tenant organization
     const user = await User.create({
        organizationId,
        name:userData.name,
        email:userData.email,
        password:userData.password,
        role:userData.role || 'TECHNICIAN',
        phone:userData.phone,
        skills:userData.skills || []
     });

     return{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        phone:user.phone,
        skills:user.skills,
        isAvaliable:user.isAvaliable,
        organizationId:user.organizationId,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
     }
 }
 /**
   * Get all Staff Members in the Organization (Optionally filter by role)
   */

 async getUserById(organizationId,userId){
    const user = await User.findOne({_id:userId,organizationId})
    if(!user){
        throw new Error ('Team member not found')
    }

    return user;
 }
/**
   * Update User Profile / Skills / Role
   */


async updateUser(organizationId,userId,updateData){
    // Prevent updating email or password through this endpoint
    delete updateData.email;
    delete updateData.password;

    const user = await user. findoneAndUpdate({
        _id:userId,organizationId
    },
    updateData,
    {new:true,runValidators:true}
);
if(!user){
    throw new Error('User not found or access denied');
}

return user;


}
/**
   * Update Live GPS Location (Used by Technician App)
   */


async updateLocation(userId,{lat,lng}){
    const user = await user. findByIdAndUpdate(
        userId,{
            currentLocation:{
                lat:Number(lat),
                lng:Number(lng),
                updatedAt:new Date()
            }
        },
        {new:true}
    );
    return user;
}

 /**
   * Delete Staff Member
   */
  async deleteUser(organizationId, userId) {
    const user = await User.findOneAndDelete({ _id: userId, organizationId });
    if (!user) {
      throw new Error('Team member not found or access denied');
    }
    return { message: 'Team member deleted successfully' };
  }
}
module.exports = new UserService();