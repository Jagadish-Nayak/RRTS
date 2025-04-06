import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Supervisor from '@/models/Supervisor';
import { verifyToken } from '@/utils/auth';
import User from '@/models/User';
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

    const supervisor = await Supervisor.findOne({ id: id })
      .select('feedbacks')
      .populate({
        path: 'feedbacks',
        model: Feedback,
        select: 'rating message complaintID createdAt userID',
        populate: {
          path: 'userID',
          model: User,
          select: 'username'
        }
      });

    // Format feedbacks as required
    const formattedFeedbacks = supervisor.feedbacks.map((feedback) => ({
      id: feedback._id,
      userId: feedback.userID._id,
      userName: feedback.userID.username,
      complaintId: feedback.complaintID,
      rating: feedback.rating,
      feedback: feedback.message,
      date: new Date(feedback.createdAt).toISOString().split('T')[0]
    }));

    return NextResponse.json({ success: true, data: formattedFeedbacks }, { status: 200 });
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get feedbacks' },
      { status: 500 }
    );
  }
}
