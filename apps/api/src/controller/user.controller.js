const userService = require('../services/user.service')


class UserController{
     // POST /api/v1/users (Add staff member)
     async create(req,res){
        try{
            const user = await userService.createUser(req.orgId,req.body);
            return res.status(201).json({
                status:'success',
                message:'Team member added successfully',
                data:user
            });
        }
        catch(error){
            return res.status(400).json({
                status:'fail',
                message:error.message
            })
        }
     }
  // GET /api/v1/users (Get all staff)
  async getAll(req, res) {
    try {
      const { role, isAvailable } = req.query;
      const users = await userService.getUsers(req.orgId, { role, isAvailable });
      return res.status(200).json({
        status: 'success',
        results: users.length,
        data: users
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  // GET /api/v1/users/:id (Get single staff member)
  async getOne(req, res) {
    try {
      const user = await userService.getUserById(req.orgId, req.params.id);
      return res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      return res.status(404).json({ status: 'fail', message: error.message });
    }
  }


        // PUT /api/v1/users/:id (Update staff member)
  async update(req, res) {
    try {
      const user = await userService.updateUser(req.orgId, req.params.id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Team member updated successfully',
        data: user
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }
  // PATCH /api/v1/users/location (Technician GPS Ping)


  async updateLocation(req,res){
    try{
        const{lat,lng} = req.body;
        if(!lat||!lng){
             return res.status(400).json({ status: 'fail', message: 'Please provide lat and lng' });
        }

    
      const user = await userService.updateLocation(req.user.userId, { lat, lng });
      return res.status(200).json({
        status: 'success',
        message: 'Location updated',
        data: user.currentLocation
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
}
 // DELETE /api/v1/users/:id
  async delete(req, res) {
    try {
      const result = await userService.deleteUser(req.orgId, req.params.id);
      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}
module.exports = new UserController();