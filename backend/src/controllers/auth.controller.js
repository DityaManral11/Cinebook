import {asyncHandler} from '../utils/asyncHandler.js';
import {loginCustomer,registerCustomer} from '../modules/auth/auth.service.js';
export const register=asyncHandler(async(req,res)=>{const {name,email,password}=req.body;if(!name?.trim()||!email?.trim()||!password||password.length<8)return res.status(400).json({success:false,message:'Name, valid email and password (at least 8 characters) are required'});const user=await registerCustomer({name:name.trim(),email:email.trim().toLowerCase(),password});res.status(201).json({success:true,message:'Account created',user});});
export const login=asyncHandler(async(req,res)=>{const {email,password}=req.body;if(!email||!password)return res.status(400).json({success:false,message:'Email and password are required'});res.json({success:true,...await loginCustomer({email:email.trim().toLowerCase(),password})});});
export const getMe=asyncHandler(async(req,res)=>res.json({success:true,user:req.user}));
