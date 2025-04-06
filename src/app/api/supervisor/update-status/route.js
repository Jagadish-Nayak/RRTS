import { NextResponse } from 'next/server';
import connectDB from '@/config/db'; 
import { verifyToken } from '@/utils/auth';
import StatusMessage from '@/models/StatusMessage';
import Complaint from '@/models/Complaint';


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

    const {complaintId, status, severity, estimatedEndDate, estimatedExpense, message} = await request.json();
    const complaint = await Complaint.findById(complaintId);
    const newMessage = await StatusMessage.create({
      complaintID: complaintId,
      userID: complaint.userID,
      supervisorID: complaint.supervisorID,
      status: status,
      message: message
    });
    complaint.status = status;
    complaint.severity = severity;
    complaint.estimatedEndTime = estimatedEndDate;
    complaint.estimatedExpense = estimatedExpense;
    complaint.statusMessages.push(newMessage._id);
    await complaint.save();
    //await User.findByIdAndUpdate(complaint.userID, { $push: { statusMessages: newMessage._id } });
    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 }
    );
  }
}
