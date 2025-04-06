import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { verifyToken } from '@/utils/auth';
import Report from '@/models/Report';
import Complaint from '@/models/Complaint';
import Supervisor from '@/models/Supervisor';
import StatusMessage from '@/models/StatusMessage';
export async function GET(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const complaintId = await params.id;

    // Find report for this complaint
    const report = await Report.findOne({ complaintID: complaintId });
    
    if (!report) {
      return NextResponse.json(
        { success: false, message: 'Report not found for this complaint' },
        { status: 404 }
      );
    }

    // Get the complaint and supervisor details
    const complaint = await Complaint.findById(complaintId)
  .select("title location report statusMessages createdAt supervisorID")
  .populate([
    {
      path: 'supervisorID',
      model: Supervisor,
      select: 'id email phone username'
    },
    {
      path: 'statusMessages',
      model: StatusMessage,
      select: 'createdAt status'
    }
  ]);

  const inspectedStatus = complaint?.statusMessages?.find(
    (msg) => msg.status === 'Inspected'
  );
  const completedStatus = complaint?.statusMessages?.find(
    (msg) => msg.status === 'Completed'
  );
  //console.log(inspectedStatus,completedStatus);
    return NextResponse.json({
      success: true,
      report,
      complaint,
      inspectedStatus: inspectedStatus?.createdAt,
      completedStatus: completedStatus?.createdAt
    }, { status: 200 });

  } catch (err) {
    console.error('Error fetching report data:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch report data' },
      { status: 500 }
    );
  }
}