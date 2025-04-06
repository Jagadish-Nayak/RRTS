import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { verifyToken } from '@/utils/auth';
import Complaint from '@/models/Complaint';
import Report from '@/models/Report';
import Supervisor from '@/models/Supervisor';

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

        await connectDB();
        const supervisorId = decoded.id;

        const supervisor = await Supervisor.findOne({ id: supervisorId });

        const completedComplaints = await Complaint.find({
            supervisorID: supervisor._id,
            status: "Completed"
        }).select("title location createdAt estimatedEndTime");

        const existingReports = await Report.find({
            supervisorID: supervisor._id
        }).select("complaintID");

        const reportlessComplaints = completedComplaints
            .filter(complaint => !existingReports.some(report =>
                report.complaintID.toString() === complaint._id.toString()
            ))
            .map(complaint => ({
                _id: complaint._id,
                title: complaint.title,
                location: complaint.location,
                submissionDate: new Date(complaint.createdAt).toISOString().split('T')[0],
                estimatedEndTime: complaint.estimatedEndTime
                    ? new Date(complaint.estimatedEndTime).toISOString().split('T')[0]
                    : null
            }));

        return NextResponse.json(
            { success: true, data: reportlessComplaints },
            { status: 200 }
        );

    } catch (err) {
        console.error('Error fetching reportless complaints:', err);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch complaints' },
            { status: 500 }
        );
    }
}



export async function POST(request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        await connectDB();
        const supervisorId = decoded.id;

        const {
            complaintId,
            totalDaysInvested,
            totalWorkers,
            costBreakdown,
            notes
        } = await request.json();
        const supervisor = await Supervisor.findOne({id: supervisorId});
        // Validate complaint exists and is completed
        const complaint = await Complaint.findOne({
            _id: complaintId,
            supervisorID: supervisor._id,
            status: "Completed"
        });

        if (!complaint) {
            return NextResponse.json(
                { success: false, message: 'Complaint not found or not eligible for report' },
                { status: 404 }
            );
        }

        // Calculate total cost
        const totalCost = Object.values(costBreakdown).reduce((a, b) => a + b, 0);

        // Create new report
        const report = new Report({
            supervisorID: supervisor._id,
            complaintID: complaintId,
            userID: complaint.userID,
            totalDaysInvested,
            totalWorkers,
            costBreakdown,
            totalCost,
            notes
        });

        await report.save();
        complaint.report = report._id;
        await complaint.save();
        return NextResponse.json(
            { success: true, data: report },
            { status: 201 }
        );

    } catch (err) {
        console.error('Error creating report:', err);
        return NextResponse.json(
            { success: false, message: 'Failed to create report' },
            { status: 500 }
        );
    }
}