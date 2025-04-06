import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Supervisor from '@/models/Supervisor';   
import { verifyToken } from '@/utils/auth';
import Complaint from '@/models/Complaint';
import Feedback from '@/models/Feedback';

connectDB();

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
    const id = decoded.id;
    const supervisor = await Supervisor.findOne({ id: id }).select('username id dob email phone address pincode complaints feedbacks').populate({
      path: 'complaints',
      model: Complaint,
      select: 'status'
    }).populate({
      path: 'feedbacks',
      model: Feedback,
      select: 'rating'
    });

    const completedComplaints = supervisor.complaints.filter(
        (c) => c.status === "Completed"
      ).length;
    
      // Count pending complaints (Not Inspected or Ongoing)
      
    
      // Calculate average rating
      const ratings = supervisor.feedbacks.map((f) => f.rating).filter((r) => r != null);
      const averageRating =
        ratings.length > 0
          ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
          : null;
    return NextResponse.json({ success: true, data : {supervisor, completedComplaints, averageRating } });
  } catch (error) {
    console.error('Error getting supervisor profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get supervisor profile' },
      { status: 500 }
    );
  }
}

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
      console.log(data);
      // Update user in MongoDB
      const updatedSupervisor = await Supervisor.findOne({id: decoded.id});
      updatedSupervisor.username = data.fullName;
      updatedSupervisor.dob = data.dob;
      updatedSupervisor.phone = data.phone;
      updatedSupervisor.address = data.address;
      await updatedSupervisor.save();
      
      if (!updatedSupervisor) {
        return NextResponse.json({ error: 'Supervisor not found' }, { status: 404 });
      }
  
      return NextResponse.json(updatedSupervisor);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }