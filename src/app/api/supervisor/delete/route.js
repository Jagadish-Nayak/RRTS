import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Supervisor from '@/models/Supervisor';
import { verifyToken } from '@/utils/auth';
import Complaint from '@/models/Complaint';

connectDB();

export async function DELETE(request) {
  try {

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
    
    const { supervisorId } = await request.json();

    if (!supervisorId) {
      return NextResponse.json({ success: false, message: 'Supervisor ID is required' }, { status: 400 });
    }

    const deletedSupervisor = await Supervisor.findOne({id: supervisorId}).select("complaints").populate({
      path: "complaints",
      model: Complaint,
      select: "status",
    });
    for(const complaint of deletedSupervisor.complaints){
      if(complaint.status !== "Completed"){
        return NextResponse.json({ success: false, message: 'Supervisor has pending complaints' }, { status: 400 });
      }
    }
    for(const complaint of deletedSupervisor.complaints){
      await Complaint.findByIdAndUpdate(complaint._id, { supervisorID: null });
    }
    await Supervisor.findOneAndDelete({id: supervisorId});
    return NextResponse.json({ success: true, message: 'Supervisor deleted successfully' });
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete supervisor' },
      { status: 500 }
    );
  }
}
