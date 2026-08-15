const jwt = require('jsonwebtoken')

/**
 * Protect Middleware: Ensures the user is logged in via a valid JWT token
 */

const protect = async(req,res,next)=>{
    let token;
     // 1. Read token from HTTP Authorization Header (Bearer <token>)
    if(req.headers.authorization&&req.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }
     // 2. Check if token exists
     if(!token){
        return res.status(401).json({
            status:'fail',
            message: 'Not authorized. Please log in to get access.'
        });
     }
     try{
         // 3. Verify JWT Token signature & expiration
         const decoded = jwt.verify(token,process.env.JWT_SECRET||'fieldloop_super_secret_jwt_key_2026');
         // 4. Fetch the User from DB using the ID from the decoded token
         req.user = decoded //// Contains { userId, organizationId, role }
         req.orgId = decoded.organizationId; // Quick shortcut for tenant isolation!
          // 5. Move to the next middleware or controller!
    next();
     }
     catch(error){
        return res.status(401).json({
            status:'fail',
            message:'Token is invalid or expired. Please log in again'
        });
     }

}

module.exports = {protect};



///[HTTP Request] ➔ [AUTH MIDDLEWARE] ➔ [RBAC MIDDLEWARE] ➔ [CONTROLLER] ➔ [RESPONSE]
               ///  (Is Token Valid?)   (Is User allowed?)
