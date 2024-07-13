import jwt from "jsonwebtoken";

export const verifyToken = async(req,res,next) =>{
    const token = req.cookies.token;
  if(!token) 

  return res.status(401).json({message:"You are not authenticated"});

  jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
  if (err)
  return res.status(403).json({message:"Token is not valid"})
req.userId =payload.id;
req.roleId = payload.role;
next();
  });

};