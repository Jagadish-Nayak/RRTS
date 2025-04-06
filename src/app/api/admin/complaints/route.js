import connectDB from "@/config/db";
import Complaint from "@/models/Complaint";
import Supervisor from "@/models/Supervisor";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import StatusMessage from "@/models/StatusMessage";

export async function GET(req) {
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
    console.log(decoded);
    const complaints = await Complaint.find().select("status createdAt pincode statusMessages report location title severity estimatedExpense supervisorID").populate([{
      path: "supervisorID",
      model: Supervisor,
      select: "username",
      },
      {
        path: "statusMessages",
        model: StatusMessage,
        select: "status message createdAt",
      }
    ]);
    const complaintsWithTimeline = complaints.map((complaint) => {
      let statusTimeline = [];

      if (complaint.statusMessages && complaint.statusMessages.length > 0) {
        for (let i = 0; i < complaint.statusMessages.length; i++) {
          const formattedDate = new Date(complaint.statusMessages[i].createdAt).toLocaleString();
          statusTimeline.push({
            status: complaint.statusMessages[i].status,
            date: formattedDate.split(',')[0],
            completed: true,
          });
        }

        const lastStatus = statusTimeline[statusTimeline.length - 1].status;
        if (lastStatus !== 'Completed') {
          statusTimeline.push({
            status: 'Completed',
            date: complaint.estimatedEndTime
              ? new Date(complaint.estimatedEndTime).toLocaleString().split(',')[0]
              : '',
            completed: false,
          });
        }
      }

      // Convert to plain JS object and attach timeline
      const plainComplaint = complaint.toObject();
      plainComplaint.statusTimeline = statusTimeline;

      return plainComplaint;
    });
    const formattedComplaints = complaintsWithTimeline.map((complaint) => ({
      id: complaint._id,
      title: complaint.title,
      submissionDate: new Date(complaint.createdAt).toLocaleDateString().split(',')[0],
      pincode: complaint.pincode,
      location: complaint.location,
      severity: complaint.severity,
      status: complaint.status==="Submitted" ? "Not Assigned" : complaint.status,
      supervisorId: complaint.supervisorID ? complaint.supervisorID.username : "-",
      estimatedExpense: complaint.estimatedExpense? complaint.estimatedExpense : "N/A",
      statusTimeline: complaint.statusTimeline,
      report: (decoded.role === "mayor")?complaint.report:null
    }));
    return NextResponse.json({ success: true, complaints: formattedComplaints }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
