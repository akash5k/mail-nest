import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";


// Login user
// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
   const {email, password} = req.body;

   const user = await User.findOne({email});

   if(user && (await user.matchPassword(password))){
      generateToken(res, user._id);
      res.status(200).json({
         _id: user.id,
         name: user.name,
         email: user.email
      });
   }else {
      res.status(400);
      throw new Error("Invalid email or password");
   }
});

// Register user
// POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
   const {name,email,password} = req.body;

   const userExists = await User.findOne({email});

   if(userExists){
      res.status(400);
      throw new Error("User already exists");
   }

   const user = await User.create({
      name,
      email,
      password
   });

   if(user){
      generateToken(res, user._id);
      res.status(200).json({
         _id: user.id,
         name: user.name,
         email: user.email
      });
   }else {
      res.status(400);
      throw new Error("Invalid user data");
   }
});

// Logout user
// POST /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
   res.cookie('jwt', '',{
      httpOnly:true,
      expires: new Date(0)
   });
   res.status(200).json({ message: "User logged out Successfully" });
});

// Get user profile
// GET /api/users/profile (private access)
const getUserProfile = asyncHandler(async (req, res) => {
   const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      appEmail: req.user.appEmail,
      emailAppPassword: req.user.emailAppPassword,
   };
   res.status(200).json(user);
});

// Update user profile
// PUT /api/users/profile (private access)
const updateUserProfile = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id);
 
   if (user) {
     user.name = req.body.name || user.name;
     user.email = req.body.email || user.email;
      user.appEmail = req.body.appEmail || user.appEmail;
      user.emailAppPassword = req.body.emailAppPassword || user.emailAppPassword;
 
     if (req.body.password) {
       user.password = req.body.password;
     }
 
     const updatedUser = await user.save();
 
     res.json({
       _id: updatedUser._id,
       name: updatedUser.name,
       email: updatedUser.email,
       appEmail: updatedUser.appEmail,
       emailAppPassword: updatedUser.emailAppPassword,
     });
   } else {
     res.status(404);
     throw new Error('User not found');
   }
 });

export {loginUser, registerUser,logoutUser,getUserProfile,updateUserProfile };
