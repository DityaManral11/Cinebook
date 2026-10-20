import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db.js';
export async function registerCustomer({name,email,password}) {
 const [existing]=await pool.execute('SELECT id FROM customers WHERE email=?',[email]);
 if(existing.length){const e=new Error('An account with this email already exists');e.statusCode=409;throw e;}
 const hash=await bcrypt.hash(password,12);
 const [result]=await pool.execute("INSERT INTO customers(name,email,password_hash,role) VALUES(?,?,?,'customer')",[name,email,hash]);
 return {id:result.insertId,name,email,role:'customer'};
}
export async function loginCustomer({email,password}) {
 const [rows]=await pool.execute('SELECT id,name,email,password_hash,role FROM customers WHERE email=?',[email]); const user=rows[0];
 if(!user||!(await bcrypt.compare(password,user.password_hash))){const e=new Error('Email or password is incorrect');e.statusCode=401;throw e;}
 const token=jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'1d'});
 return {token,user:{id:user.id,name:user.name,email:user.email,role:user.role}};
}
