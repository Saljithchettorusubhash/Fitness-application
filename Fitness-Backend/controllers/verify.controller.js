import jwt from "jsonwebtoken";
export const shouldBeLoggedIn = async (req, res) => {

console.log(req.userId)  
console.log(req.roleId)

  res.status(200).json({ message: "You are authenticated" });
};




export const verifyAdmin = async (req, res,next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "You are not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET_KEY,  (err, payload) => {
    try {
      if (err) return res.status(403).json({ message: "Token is not valid" });
      console.log("Payload:", payload);  

    } catch (err) {
      console.log(err);
    }

    if (!payload.role != 'Admin')
      return res.status(403).json({ message: "You are not authorized" });

    req.userId = payload.id;
    req.userRole = payload.role;
    return res.status(200).json({message:"admin acknowledged"})
    next();
    });
};
