// import connectDB from "@/config/db";
// import Complaint from "@/models/Complaint";
// import Supervisor from "@/models/Supervisor";
// import { verifyToken } from "@/utils/auth";
// import { NextResponse } from "next/server";
// import Feedback from "@/models/Feedback";

// export async function GET(req) {
//   try {
//     await connectDB();
//     // Extract token from headers
//     const token = req.headers.get('Authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
//     }
//     const pincode = req.nextUrl.searchParams.get('pincode');
//     const supervisorsRaw = await Supervisor.find({ pincode: pincode })
//   .select("username id phone complaints dob feedbacks")
//   .populate({
//     path: "complaints",
//     model: Complaint,
//     select: "status",
//   })
//   .populate({
//     path: "feedbacks",
//     model: Feedback,
//     select: "rating",
//   });

// const supervisors = supervisorsRaw.map((supervisor) => {
//   // Count completed complaints
//   const completedComplaints = supervisor.complaints.filter(
//     (c) => c.status === "Completed"
//   ).length;

//   // Count pending complaints (Not Inspected or Ongoing)
//   const pendingComplaints = supervisor.complaints.filter(
//     (c) => c.status === "Not Inspected" || c.status === "Ongoing"
//   ).length;

//   // Calculate average rating
//   const ratings = supervisor.feedbacks.map((f) => f.rating).filter((r) => r != null);
//   const averageRating =
//     ratings.length > 0
//       ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
//       : null;
//       return {
//         id: supervisor.id,
//         username: supervisor.username,
//         phone: supervisor.phone,
//         pincode: supervisor.pincode,
//         completedComplaints,
//         pendingComplaints,
//         averageRating,
//         dob: supervisor.dob,
//       };
//     });
//     // Find and populate complaints with selected fields

//     return NextResponse.json({ success: true, supervisors }, { status: 200 });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
//   }
// }

import connectDB from "@/config/db";
import Complaint from "@/models/Complaint";
import Supervisor from "@/models/Supervisor";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import Feedback from "@/models/Feedback";

export async function GET(req) {
  try {
    await connectDB();

    // Token auth
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const pincode = req.nextUrl.searchParams.get('pincode');

    const supervisorsRaw = await Supervisor.find({ pincode })
      .select("username id phone complaints dob feedbacks pincode")
      .populate({
        path: "complaints",
        model: Complaint,
        select: "status",
      })
      .populate({
        path: "feedbacks",
        model: Feedback,
        select: "rating",
      });

    const supervisors = supervisorsRaw.map((supervisor) => {
      const completedComplaints = supervisor.complaints.filter(
        (c) => c.status === "Completed"
      ).length;

      const pendingComplaints = supervisor.complaints.filter(
        (c) => c.status === "Not Inspected" || c.status === "Ongoing"
      ).length;

      const ratings = supervisor.feedbacks.map((f) => f.rating).filter((r) => r != null);
      const averageRating = ratings.length > 0
        ? parseFloat((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2))
        : 0;

      const age = new Date().getFullYear() - new Date(supervisor.dob).getFullYear();

      return {
        id: supervisor.id,
        name: supervisor.username,
        phone: supervisor.phone,
        pincode: supervisor.pincode,
        completedTasks: completedComplaints,
        pendingTasks: pendingComplaints,
        rating: averageRating,
        age,
      };
    });

    // Sort by pendingTasks descending
    supervisors.sort((a, b) => b.pendingTasks - a.pendingTasks);

    return NextResponse.json({ success: true, supervisors }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
