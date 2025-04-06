import mongoose from "mongoose";
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
   userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   supervisorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supervisor'
   },
   complaintID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint'
   },
   rating: {
      type: Number,
      min: 1,
      max: 5
   },
   message: {
      type: String,
      trim: true
   }
}, { timestamps: true });


const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;