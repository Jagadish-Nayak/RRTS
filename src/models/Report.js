import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reportSchema = new Schema({
   supervisorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supervisor',
      required: true
   },
   complaintID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
   },
   userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   totalDaysInvested: {
      type: Number,
      required: true
   },
   totalWorkers: {
      type: Number,
      required: true
   },
   costBreakdown: {
      materials: {
         type: Number,
         required: true
      },
      labor: {
         type: Number,
         required: true
      },
      equipment: {
         type: Number,
         required: true
      },
      miscellaneous: {
         type: Number,
         required: true
      }
   },
   totalCost: {
      type: Number,
      required: true
   },
   notes: {
      type: String,
      required: false
   }
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;