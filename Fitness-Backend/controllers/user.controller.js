import prisma from "../lib/prisma.js"
import bcrypt from 'bcrypt'
import { validateUser,validateUserUpdate } from "../validators/user.valiodator.js";

export const getUser = async(req,res)=>{
    console.log("its working")
    try{
const users = await prisma.user.findMany();
res.status(200).json({data:users,message:"The list of the users"})
    }
    catch (err){
        console.log(err)
        res.status(500).json({message:"unable to fetch the users"})

    }

}
export const getUsers = async(req,res)=>{
    const id = parseInt(req.params.id,10);
   if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
    try{
       const user = await prisma.user.findUnique({where:{id:id}}) 
       res.status(200).json({value    :user,message:"User fertched"})

    }
    catch (err){
        console.log(err)
        res.status(200).json({message:"unable to fetch the requested user"})

    }

}

export const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { password,dob,role, ...inputs } = req.body; // Exclude role from update
  
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
  
    if (id !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const { error } = validateUserUpdate(inputs);
    if (error) {
      return res.status(400).json({ message: error.details.map(err => err.message) });
    }
  
    let updatedPassword = null;
    let updatedDob = dob? new Date(dob).toISOString():undefined;
  
    try {
      if (password) {
        updatedPassword = await bcrypt.hash(password, 10);
      }
  
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...inputs,
          ...(updatedPassword && { password: updatedPassword }),
          ...(updatedDob && {dob:updatedDob})
        },
      });
  
      console.log(user);
      res.status(200).json({ data: user, message: "User updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Unable to update the requested user" });
    }
  };

export const deleteUser = async(req,res)=>{
     
    const id = parseInt(req.params.id);

    try{
        const user = await prisma.user.delete({where:{id:id}})
        res.status(200).json({message:"user account deleted"})



    }
    catch (err){
        console.log(err)
        res.status(500).json({message:"unable to delete the requested user"})

    }
}

