import connectDB from "@/config/db";
import Complaint from "@/models/Complaint";
import Supervisor from "@/models/Supervisor";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import StatusMessage from "@/models/StatusMessage";

export async function POST(req) {
  try {
    await connectDB();
    // Extract token from headers
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
    
    const { complaintId, supervisorId } = await req.json();
    const supervisor = await Supervisor.findOne({id: supervisorId});
    supervisor.complaints.push(complaintId);
    await supervisor.save();
    const complaint = await Complaint.findById(complaintId);
    const message = await StatusMessage.create({
      complaintID: complaintId,
      supervisorID: supervisor._id,
      userID: complaint.userID,
      message: `Supervisor ${supervisor.id} assigned to complaint`,
      status: "Supervisor Assigned"
    });

    complaint.supervisorID = supervisor._id;
    complaint.status = "Supervisor Assigned";
    complaint.statusMessages.push(message._id);
    await complaint.save();
    return NextResponse.json({ success: true}, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
