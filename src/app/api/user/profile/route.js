import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/config/db';
import { verifyToken } from '@/utils/auth';

// Connect to MongoDB
connectDB();

// GET /api/user/profile
export async function GET(request) {
  try {
    // Verify JWT token from request headers
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: decoded.email }).select(
      '-password'
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(request) {
  try {
    // Verify JWT token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await request.json();

    // Update user in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email },
      {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        gender: data.gender,
        phone: data.phone,
        pincode: data.pincode,
        address: data.address,
      },
      { new: true, select: 'firstName lastName email dob gender phone pincode address isVerified avatar' }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
