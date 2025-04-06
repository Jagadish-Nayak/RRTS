import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { uploadToCloudinary } from '@/config/cloudinary';
import connectDB from '@/config/db';
import Complaint from '@/models/Complaint';
import User from '@/models/User';
import StatusMessage from '@/models/StatusMessage';

export async function POST(request) {
  try {
    // Authenticate user
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
    //console.log(decoded);
    await connectDB(); // Connect to MongoDB

    // Get form data
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const location = formData.get('location');
    const pincode = formData.get('pincode');
    const severity = formData.get('severity');
    const images = formData.getAll('images');

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
        const result = await uploadToCloudinary(base64Image, 'complaints');
        return result.secure_url;
      })
    );
    
    // Create complaint
    const complaint = await Complaint.create({
      title,
      description,
      location,
      pincode,
      severity,
      images: imageUrls,
      userID: decoded.id,
    });
    const newStatusMessage = new StatusMessage({
      complaintId: complaint._id,
      userId: complaint.userID, // Assuming 'userId' exists in Complaint model
      message: `Complaint submitted successfully`,
      status: "Submitted"
    });
    await newStatusMessage.save();
    await Complaint.findByIdAndUpdate(complaint._id, {
      $push: { statusMessages: newStatusMessage._id },
    });
    const user = await User.findById(complaint.userID);

      if (user) {
        // Push complaint ID if not already present
        if (!user.complaints.includes(complaint._id)) {
          user.complaints.push(complaint._id);
          await user.save();
        }
      }

    return NextResponse.json({ 
      message: 'Complaint submitted successfully', 
      complaint,
      success: true 
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json({ error: 'Failed to submit complaint', success: false }, { status: 500 });
  }
}
