import connectDB from "@/config/db";
import Complaint from "@/models/Complaint";
import User from "@/models/User";
import Supervisor from "@/models/Supervisor";
import StatusMessage from "@/models/StatusMessage";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const complaints = await Complaint.find({ _id: { $in: user.complaints } })
      .select("title location severity status statusMessages feedback estimatedEndTime supervisorID createdAt")
      .populate({
        path: "supervisorID",
        model: Supervisor,
        select: "username",
      })
      .populate({
        path: "statusMessages",
        model: StatusMessage,
        select: "status message createdAt",
      });

    const formattedComplaints = complaints.map((complaint) => {
      const statusTimeline = [];

      if (complaint.statusMessages?.length) {
        complaint.statusMessages.forEach((msg) => {
          const date = new Date(msg.createdAt).toISOString().split("T")[0];
          statusTimeline.push({
            status: msg.status,
            date,
            completed: true,
          });
        });

        const lastStatus = statusTimeline[statusTimeline.length - 1].status;
        if (lastStatus !== 'Completed') {
          statusTimeline.push({
            status: 'Completed',
            date: complaint.estimatedEndTime
              ? new Date(complaint.estimatedEndTime).toISOString().split("T")[0]
              : '',
            completed: false,
          });
        }
      }

      return {
        id: complaint._id,
        title: complaint.title,
        location: complaint.location?.split(',')[0] || '',
        submissionDate: new Date(complaint.createdAt).toISOString().split("T")[0],
        status: complaint.status,
        supervisor: complaint.supervisorID?.username || "-",
        severity: complaint.severity,
        estimatedEndDate: complaint.estimatedEndTime
          ? new Date(complaint.estimatedEndTime).toISOString().split("T")[0]
          : "N/A",
        feedback: !!complaint.feedback,
        statusTimeline
      };
    });

    return NextResponse.json({ success: true, complaints: formattedComplaints }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
