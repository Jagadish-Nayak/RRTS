import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Supervisor from '@/models/Supervisor';   
import { verifyToken } from '@/utils/auth';
import bcrypt from 'bcryptjs';

connectDB();

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const data = await request.json();

    const existingSupervisor = await Supervisor.findOne({ supervisorId: data.supervisorId });

    if (existingSupervisor) {
      return NextResponse.json(
        { success: false, message: 'Supervisor ID already exists' },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.supervisorId, salt);
    // Create new supervisor
    const supervisor = new Supervisor({
      id: data.supervisorId,
      username: data.fullName,
      email: data.email,
      phone: data.phone,
      pincode: data.pincode,
      dob: data.dob,
      password: hashedPassword, // Set initial password as supervisor ID
    });

    await supervisor.save();

    return NextResponse.json({ success: true, data: supervisor });
  } catch (error) {
    console.error('Error creating supervisor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create supervisor' },
      { status: 500 }
    );
  }
}
