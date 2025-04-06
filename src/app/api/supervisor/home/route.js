import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Supervisor from '@/models/Supervisor';   
import { verifyToken } from '@/utils/auth';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import StatusMessage from '@/models/StatusMessage';

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

    const supervisor = await Supervisor.findOne({ id: id })
      .select('complaints')
      .populate({
        path: 'complaints',
        model: Complaint,
        select: 'title location severity userID status statusMessages report images',
        populate: [
          {
            path: 'userID',
            model: User,
            select: 'username phone',
          },
          {
            path: 'statusMessages',
            model: StatusMessage,
            select: 'status createdAt',
            options: { sort: { createdAt: -1 }, limit: 1 },
          },
        ],
      });

    // Format the complaints
    const formattedComplaints = [];
    const events = [];

    let completed = 0;
    let ongoing = 0;
    let pending = 0;
    let rejected = 0;

    let high = 0;
    let medium = 0;
    let low = 0;

    for (const item of supervisor.complaints) {
      const lastStatus = item.status;
      const severity = item.severity;

      if (lastStatus === 'Completed') completed++;
      else if (lastStatus === 'Ongoing') ongoing++;
      else if (lastStatus === 'Supervisor Assigned' || lastStatus === 'Inspected') pending++;
      else if (lastStatus === 'Rejected') rejected++;

      if (severity === 'High') high++;
      else if (severity === 'Medium') medium++;
      else if (severity === 'Low') low++;

      if (lastStatus === 'Supervisor Assigned') {
        formattedComplaints.push({
          id: item._id,
          userName: item.userID.username,
          phone: item.userID.phone,
          title: item.title,
          location: item.location.split(',')[0],
          images: item.images,
          severity: item.severity,
        });
      }

      // Add upcoming events for status updates
      if (lastStatus !== 'Completed' && lastStatus !== 'Rejected') {
        const createdDate = new Date(item.statusMessages[0]?.createdAt || new Date());
        createdDate.setDate(createdDate.getDate() + 10);

        events.push({
          date: createdDate.toISOString().split('T')[0],
          time: createdDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          title: lastStatus === 'Supervisor Assigned' ? 'Inspection Due Date' : 'Status Update',
          type: lastStatus,
          name: item.title,
        });

        // Optional: handle report due if needed
        if (lastStatus === 'Completed' && item.report === null) {
          events.push({
            date: new Date(item.statusMessages[0]?.createdAt || new Date()).toISOString().split('T')[0],
            time: new Date(item.statusMessages[0]?.createdAt || new Date()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            title: 'Report Due Date',
            type: 'Completed',
            name: item.title,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        complaints: formattedComplaints,
        events,
        stats: {
          completed,
          ongoing,
          pending,
          rejected,
          high,
          medium,
          low,
        },
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating supervisor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get supervisor complaints' },
      { status: 500 }
    );
  }
}
