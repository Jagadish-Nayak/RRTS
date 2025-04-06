// import { NextResponse } from 'next/server';
// import connectDB from '@/config/db';
// import Supervisor from '@/models/Supervisor';   
// import { verifyToken } from '@/utils/auth';
// import User from '@/models/User';
// import Complaint from '@/models/Complaint';


// export async function GET(request){
//     try{
//         const token = request.headers.get('Authorization')?.split(' ')[1];
//         if (!token) {
//             return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//         }

//         const decoded = verifyToken(token);

//     if (!decoded) {
//       return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
//     }
//     const userId = decoded.id;
//     const allComplaints = await User.findById(userId).select("complaints").populate({
//         path: "complaints",
//         model: Complaint,
//         select: "status feedback"
//     })
//     let arr = [];
//     console.log(allComplaints);
//     for(const i=0;i<allComplaints.length;i++){
//         if(allComplaints[i].status === 'Completed' && allComplaints[i].feedback === null){
//             console.log(allComplaints[i]);
//             arr.push(allComplaints[i]);
//         }
//     }
//     // const user = await User.findById(userId);
//     // const filtered = user.complaints.filter(
//     //     complaint => complaint.status === "Completed" && complaint.feedback.length === 0
//     // )
//     // console.log(filtered);
//     return NextResponse.json(
//         { success: true, data:filtered },
//         { status: 200 }
//       ); 
//     }catch(err){
//         console.error('Error during submitting the feedback', err);
//         return NextResponse.json(
//           { success: false, message: 'Failed to submit the feedback' },
//           { status: 500 }
//         );
//     }
// }

// export async function POST(request){
//     try{

//     }catch(err){
//         console.error('Error during submitting the feedback', err);
//     return NextResponse.json(
//       { success: false, message: 'Failed to submit the feedback' },
//       { status: 500 }
//     );
//     }
// }
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Supervisor from '@/models/Supervisor';
import { verifyToken } from '@/utils/auth';
import User from '@/models/User';
import Complaint from '@/models/Complaint';
import Feedback from '@/models/Feedback';

export async function GET(request) {
    try {
        // Extract token
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        await connectDB();
        const userId = decoded.id;

        // Fetch user complaints with population
        const user = await User.findById(userId)
            .select("complaints")
            .populate({
                path: "complaints",
                model: Complaint,
                select: "title status estimatedEndTime feedback"
            });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Filter complaints where status is "Completed" and feedback is an empty array
        const filteredComplaints = user.complaints.filter(
            complaint => complaint.status === "Completed" && (complaint.feedback === undefined || complaint.feedback === null)
        );

        return NextResponse.json(
            { success: true, data:filteredComplaints },
            { status: 200 }
        );

    } catch (err) {
        console.error('Error fetching complaints:', err);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch complaints' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        // Placeholder for POST logic
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        await connectDB();
        const userId = decoded.id;
        const {complaintId, rating, message} = await request.json();
        if(!complaintId || !rating || !message){
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }
        const sup = await Complaint.findById(complaintId).select("supervisorID");
        //console.log(supervisorID);
        const data = await Feedback.create({
            userID: userId,
            supervisorID : sup.supervisorID,
            complaintID: complaintId,
            rating,
            message, 
        })
        await Complaint.findByIdAndUpdate(complaintId, {feedback: data._id});
        await User.findByIdAndUpdate(userId, { $push: { feedbacks: data._id } });
        await Supervisor.findByIdAndUpdate(sup.supervisorID, { $push: { feedbacks: data._id } });
        return NextResponse.json(
            { success: true, message: "Feedback Submitted successfully",data:data},
            { status: 200 }
        );
    } catch (err) {
        console.error('Error during submitting the feedback', err);
        return NextResponse.json(
            { success: false, message: 'Failed to submit the feedback' },
            { status: 500 }
        );
    }
}
