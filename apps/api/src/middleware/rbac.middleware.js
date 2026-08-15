/**
 * Authorize Middleware: Restricts access to specific user roles
 * Usage: authorize('OWNER', 'DISPATCHER')
 */
//...allowedRoles (Rest Operator): Allows us to pass multiple roles like authorize('OWNER', 'DISPATCHER'), which converts them into an array ['OWNER', 'DISPATCHER'].
//
const authorize = (...allowedRoles)=>{
    return (req,res,next)=>{
         // Ensure req.user exists (set by protect middleware)
         if(!req.user||!req.user.role){
            return res.status(401).json({
                status:'fail',
                message:'Unauthorized Access'
            });
         }
          //allowedRoles.includes(req.user.role): Checks if the logged-in user's role matches any allowed role.
          //res.status(403): HTTP 403 Forbidden means "We know who you are, but you do not have permission to perform this action" (e.g. A technician trying to delete the company account).
         if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
        status: 'fail',
        message: `Forbidden: Role '${req.user.role}' is not allowed to perform this action.`
      });
         }
          next();
    };
}


module.exports = { authorize };