import connectDB from "@/config/db";
import Complaint from "@/models/Complaint";
import StatusMessage from "@/models/StatusMessage";

export async function POST() {
  try {
    await connectDB(); // Ensure DB connection

    // Find all complaints with status "Submitted"
    const complaints = await Complaint.find({ status: "Submitted" });

    if (complaints.length === 0) {
      return Response.json({ message: "No submitted complaints found" }, { status: 200 });
    }

    // Iterate over complaints and create status messages
    const statusMessages = [];
    for (const complaint of complaints) {
      const newStatusMessage = new StatusMessage({
        complaintID: complaint._id,
        userID: complaint.userID, // Assuming 'userId' exists in Complaint model
        message: `Complaint submitted successfully`,
      });

      await newStatusMessage.save(); // Save to StatusMessage DB
      statusMessages.push(newStatusMessage._id); // Store new message IDs

      // Update complaint with new statusMessage reference
      await Complaint.findByIdAndUpdate(complaint._id, {
        $push: { statusMessages: newStatusMessage._id },
      });
    }

    return Response.json(
      { message: "Status messages updated successfully", statusMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating status messages:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
