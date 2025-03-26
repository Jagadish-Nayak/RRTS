import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Supervisor from '@/models/Supervisor';
import { verifyToken } from '@/utils/auth';

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

    const deletedSupervisor = await Supervisor.findOneAndDelete({ supervisorId });

    if (!deletedSupervisor) {
      return NextResponse.json({ success: false, message: 'Supervisor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Supervisor deleted successfully' });
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete supervisor' },
      { status: 500 }
    );
  }
}
