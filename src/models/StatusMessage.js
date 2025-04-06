import mongoose from "mongoose";
const Schema = mongoose.Schema;

const statusMessageSchema = new Schema({
   complaintID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint'
   },
   userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   supervisorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supervisor'
   },
   status: {
      type: String,
      enum: ["Submitted","Supervisor Assigned", "Inspected", "Ongoing", "Completed", "Rejected"],
      default: "Submitted"
   },
   message: {
      type: String,
      maxlength: 70,
      trim: true
   }
}, { timestamps: true });


const StatusMessage = mongoose.models.StatusMessage || mongoose.model('StatusMessage', statusMessageSchema);

export default StatusMessage;