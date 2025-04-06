import mongoose from "mongoose";
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    supervisorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supervisor'
    },
    title: {
        type: String,
        required: true,
        trim: true
    }, 
    location: {
        type: String
    },
    pincode: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String
    }],
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"]
    },
    status: {
        type: String,
        enum: ["Submitted","Supervisor Assigned", "Inspected", "Ongoing", "Completed", "Rejected"],
        default: "Submitted"
    },
    feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    estimatedExpense: {
        type: Number,
        min: 0
    },
    estimatedEndTime: {
        type: Date,
    },
    statusMessages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StatusMessage'
        }
    ],
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);

export default Complaint; 