// import { NextResponse } from 'next/server';
// import User from '@/models/User';
// import connectDB from '@/config/db';
// import { verifyToken } from '@/utils/auth';
// import Supervisor from '@/models/Supervisor';
// import StatusMessage from '@/models/StatusMessage';
// import Complaint from '@/models/Complaint';

// export async function GET(request) {
//   try {
//     const token = request.headers.get('Authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }
//     connectDB();
//     // Find user in MongoDB
//     const user = await User.findOne({ email: decoded.email }).select(
//       'username pincode complaints feedbacks'
//     ).populate({
//         path:"complaints",
//         model:Complaint,
//         select:"status"
//     });
//     const allSupervisors = await Supervisor.find({pincode:{$eq:user.pincode}}).select("id username phone");
//     const allMessages = await StatusMessage.find({userID:{$eq:user._id}}).select("status message complaintID createdAt").populate({
//         path:"complaintID",
//         model: Complaint,
//         select:"title location",
//     }).sort({createdAt:-1});
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     return NextResponse.json({user,allSupervisors,allMessages},{ status: 200 });
//   }catch(error){
//     console.error(error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/config/db';
import { verifyToken } from '@/utils/auth';
import Supervisor from '@/models/Supervisor';
import StatusMessage from '@/models/StatusMessage';
import Complaint from '@/models/Complaint';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: decoded.email })
      .select('username pincode complaints feedbacks')
      .populate({
        path: "complaints",
        model: Complaint,
        select: "status"
      });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Compute complaint statistics
    const totalComplaints = user.complaints?.length || 0;
    const completedComplaints = user.complaints.filter(c => c.status === 'Completed').length;
    const pendingComplaints = user.complaints.filter(c =>
      ['Submitted', 'Supervisor Assigned', 'Inspected'].includes(c.status)
    ).length;
    const ongoingComplaints = user.complaints.filter(c => c.status === 'Ongoing').length;
    const rejectedComplaints = user.complaints.filter(c => c.status === 'Rejected').length;
    const totalFeedbacks = user.feedbacks?.length || 0;

    // Format supervisor data
    const supervisorsRaw = await Supervisor.find({ pincode: user.pincode }).select("id username phone");
    const allSupervisors = supervisorsRaw.map(s => ({
      id: s.id,
      name: s.username,
      contactNumber: s.phone
    }));

    // Format messages
    const messagesRaw = await StatusMessage.find({ userID: user._id })
      .select("status message complaintID createdAt")
      .populate({
        path: "complaintID",
        model: Complaint,
        select: "title location",
      })
      .sort({ createdAt: -1 });

    const allMessages = messagesRaw.map(msg => ({
      id: msg._id,
      complaint: msg.complaintID?.title || 'N/A',
      title: msg.status,
      content: msg.message,
      date: new Date(msg.createdAt).toISOString().split("T")[0],
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalComplaints,
        completedComplaints,
        pendingComplaints,
        ongoingComplaints,
        rejectedComplaints,
        totalFeedbacks,
        allSupervisors,
        allMessages
      }
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
