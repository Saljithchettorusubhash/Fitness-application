import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { email, name, password, dob, role } = req.body;
  console.log(req.body);
  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log(hashedpassword);

    let newUser;
    if (role === "User") {
      newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedpassword,
          dob: new Date(dob),
          role,
        },
      });
    } else if (role === "Trainer") {
      newUser = await prisma.trainer.create({
        data: {
          email,
          name,
          password: hashedpassword,
          dob: new Date(dob),
          role,
        },
      });
    } else if (role === "Admin") {
      newUser = await prisma.admin.create({
        data: {
          email,
          name,
          password: hashedpassword,
          role,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    console.log(newUser);
    res.status(201).json({ message: "User Created", value: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to craete User" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await prisma.user.findUnique({ where: { email: email } });
    let role = "User";

    if (!user) {
      user = await prisma.trainer.findUnique({ where: { email: email } });
      role = "Trainer";
    }
    if (!user) {
      user = await prisma.admin.findUnique({ where: { email: email } });
      role = "Admin";
    }
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials" });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        role: role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: "Login Successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to  login", value: err });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
