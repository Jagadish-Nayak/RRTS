import connectDB from "@/config/db";
import Complaint from "@/models/Complaint";
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
    const supervisor = await Supervisor.findOne({ id: userId });

    if (!supervisor) {
      return NextResponse.json({ success: false, message: "Supervisor not found" }, { status: 404 });
    }

    const complaints = await Complaint.find({ _id: { $in: supervisor.complaints } })
      .select("title location severity status statusMessages estimatedEndTime createdAt estimatedExpense")
      .populate({
        path: "statusMessages",
        model: StatusMessage,
        select: "status message createdAt",
      });

    const formattedComplaints = complaints.map((complaint) => {
      let statusTimeline = [];

      if (complaint.statusMessages?.length) {
        for (let msg of complaint.statusMessages) {
          statusTimeline.push({
            status: msg.status,
            date: new Date(msg.createdAt).toISOString().split("T")[0],
            completed: true
          });
        }

        const lastStatus = statusTimeline[statusTimeline.length - 1]?.status;
        if (lastStatus !== "Completed") {
          statusTimeline.push({
            status: "Completed",
            date: complaint.estimatedEndTime
              ? new Date(complaint.estimatedEndTime).toISOString().split("T")[0]
              : "",
            completed: false
          });
        }
      }

      return {
        id: complaint._id,
        title: complaint.title,
        submissionDate: new Date(complaint.createdAt).toISOString().split("T")[0],
        location: complaint.location?.split(",")[0] || "",
        status: complaint.status,
        estimatedExpense: complaint.estimatedExpense || "N/A",
        severity: complaint.severity,
        estimatedEndDate: complaint.estimatedEndTime
          ? new Date(complaint.estimatedEndTime).toISOString().split("T")[0]
          : "",
        statusTimeline: statusTimeline
      };
    });

    return NextResponse.json({ success: true, complaints: formattedComplaints }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
