import { NextResponse } from 'next/server';
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
    connectDB();
    // Find user in MongoDB
    //const complaints = await Complaint.find().select("status pincode");
    const pincodeComplaints = await Complaint.aggregate([
      {
          $group: {
              _id: "$pincode",
              allComplaints: {
                  $sum: 1
              },
              pending: {
                  $sum: {
                      $cond: [
                          { $in: ["$status", ["Submitted", "Supervisor Assigned", "Inspected"]] },
                          1,
                          0
                      ]
                  }
              },
              ongoing: {
                  $sum: {
                      $cond: [
                          { $eq: ["$status", "Ongoing"] },
                          1,
                          0
                      ]
                  }
              },
              completed: {
                  $sum: {
                      $cond: [
                          { $eq: ["$status", "Completed"] },
                          1,
                          0
                      ]
                  }
              },
              rejected: {
                  $sum: {
                      $cond: [
                          { $eq: ["$status", "Rejected"] },
                          1,
                          0
                      ]
                  }
              }
          }
      },
      {
          $sort: { "_id": 1 }
      }
  ]);
    const allSupervisors = await Supervisor.find().countDocuments();
    const allComplaints = await Complaint.find().countDocuments();
    const pincodeCount = await Supervisor.distinct("pincode").then(pincodes => pincodes.length);
    const statuscounts = await StatusMessage.aggregate([
      {
          $group: {
              _id: {
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  complaintID: "$complaintID",
                  status: "$status"
              },
          }
      },
      {
          $group: {
              _id: "$_id.date",
              pending: {
                  $sum: {
                      $cond: [
                          { $in: ["$_id.status", ["Submitted", "Supervisor Assigned", "Inspected", "Ongoing"]] },
                          1,
                          0
                      ]
                  }
              },
              completed: {
                  $sum: {
                      $cond: [
                          { $eq: ["$_id.status", "Completed"] },
                          1,
                          0
                      ]
                  }
              },
              rejected: {
                  $sum: {
                      $cond: [
                          { $eq: ["$_id.status", "Rejected"] },
                          1,
                          0
                      ]
                  }
              }
          }
      },
      {
          $sort: { "_id": 1 }
      }
  ]);
    
    return NextResponse.json({pincodeComplaints,allSupervisors,pincodeCount,statuscounts,allComplaints},{ status: 200 });
  }catch(error){
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}