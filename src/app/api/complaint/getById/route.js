import connectDB from "@/config/db";
import Complaint from "@/models/Complaint";
import { verifyToken } from '@/utils/auth';
import { NextResponse } from "next/server";
import Feedback from "@/models/Feedback";
import Supervisor from "@/models/Supervisor";
import StatusMessage from "@/models/StatusMessage";
import User from "@/models/User";

export async function POST(req) {
  try {

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    // Extract complaintId from the request body
    const { complaintId } = await req.json();
    if (!complaintId) {
      return NextResponse.json({ message: "Complaint ID is required", success: false }, { status: 400 });
    }

    // Fetch the complaint and populate required fields
    const complaint = await Complaint.findById(complaintId)
      .select("title description location pincode severity status createdAt images estimatedExpense estimatedEndTime statusMessages feedback supervisorID")
      .populate({
        path: "statusMessages",
        model: StatusMessage,
        select: "status message createdAt",
      })
      .populate({
        path: "feedback",
        model: Feedback,
        select: "rating message",
      })
      .populate({
        path: "supervisorID",
        model: Supervisor,
        select: "username email phone pincode complaints feedbacks",
      })
      .populate({
        path: 'userID',
        model: User,
        select: "username phone",
      });

    if (!complaint) {
      return NextResponse.json({ message: "Complaint not found", success: false }, { status: 404 });
    }

    let completedTasks = 0;
    let totalRating = 0;
    let ratingCount = 0;

    if (complaint.supervisorID) {
      // Fetch the supervisor's complaints and calculate completed tasks and average rating
      const supervisorComplaints = await Complaint.find({
        _id: { $in: complaint.supervisorID.complaints },
      }).select("status");
      const feedbacks = await Feedback.find({
        _id: { $in: complaint.supervisorID.feedbacks   },
      }).select("rating");

      supervisorComplaints.forEach((c) => {
        if (c.status === "Completed") {
          completedTasks++;
        }
      });
      feedbacks.forEach((f) => {
        totalRating += f.rating;
        ratingCount++;
      });
    }

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : null;

    return NextResponse.json({
      complaint: {
        id: complaint._id,
        userName: complaint.userID.username,
        phone: complaint.userID.phone,
        title: complaint.title,
        description: complaint.description,
        location: complaint.location,
        pincode: complaint.pincode,
        severity: complaint.severity,
        status: complaint.status,
        submissionDate: complaint.createdAt,
        images: complaint.images,
        estimatedExpense: complaint.estimatedExpense,
        estimatedCompletionDate: complaint.estimatedEndTime,
        statusUpdates: complaint.statusMessages?.map(statusMessage => ({
          id: statusMessage._id,
          date: statusMessage.createdAt,
          message: statusMessage.message,
          status: statusMessage.status
        })),
        rating: complaint.feedback?.rating,
        message: complaint.feedback?.message,
        assignedSupervisor: complaint.supervisorID
          ? {
              name: complaint.supervisorID.username,
              email: complaint.supervisorID.email,
              contactNumber: complaint.supervisorID.phone,
              pincode: complaint.supervisorID.pincode,
              completedTasks,
              rating: averageRating,
              ratingCount,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
