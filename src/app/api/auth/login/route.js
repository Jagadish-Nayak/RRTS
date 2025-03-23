import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from '@/config/db';
import User from '@/models/User';
import Supervisor from '@/models/Supervisor';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, role, password, rememberMe } = body;
    
    // Special handling for admin and mayor
    if (role === 'admin') {
      const adminPass = process.env.ADMIN_PASS;
      
      if (identifier !== 'admin' || password !== adminPass) {
        return NextResponse.json(
          { success: false, message: 'Invalid admin credentials' },
          { status: 401 }
        );
      }
      
      // Admin authentication successful
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: rememberMe ? '30d' : '24h' }
      );
      
      // Set cookie
      const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      await cookies().set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: cookieExpiry,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Admin login successful',
        user: {
          id: 'admin',
          role: 'admin',
          username: 'Administrator'
        },
        token
      });
    }
    
    if (role === 'mayor') {
      const mayorPass = process.env.MAYOR_PASS;
      
      if (identifier !== 'mayor' || password !== mayorPass) {
        return NextResponse.json(
          { success: false, message: 'Invalid mayor credentials' },
          { status: 401 }
        );
      }
      
      // Mayor authentication successful
      const token = jwt.sign(
        { id: 'mayor', role: 'mayor' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: rememberMe ? '30d' : '24h' }
      );
      
      // Set cookie
      const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      await cookies().set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: cookieExpiry,
      });
      
      return NextResponse.json({
        success: true,
        message: 'Mayor login successful',
        user: {
          id: 'mayor',
          role: 'mayor',
          username: 'Mayor'
        },
        token
      });
    }
    
    // For user and supervisor roles, check from the database
    await connectDB();
    
    // Try to find user by email (identifier + @gmail.com)
    let user;
    
    if (role === 'user') {
      // Check if identifier is an email or username
        user = await User.findOne({ email: `${identifier}@gmail.com` });
    } else if (role === 'supervisor') {
      // For supervisor, search by username
      user = await Supervisor.findOne({id: identifier});
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create token
    const token = jwt.sign(
      { 
        id: user.role === 'user'?user._id:user.id, 
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: rememberMe ? '30d' : '24h' }
    );
    
    // Set cookie
    const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    await cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieExpiry,
    });
    
    // Prepare user data (don't send password)
    let userData;
    if(user.role === 'user'){
      userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified || false,
        phone: user.phone,
        address: user.address,
        pincode: user.pincode,
        dob: user.dob,
        gender: user.gender,
        complaints: user.complaints,
        feedbacks: user.feedbacks,
      }
    }else if(user.role === 'supervisor'){
      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        complaints: user.complaints,
        feedbacks: user.feedbacks,
      }
    }

    return NextResponse.json({
      success: true,
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
      user: userData,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 