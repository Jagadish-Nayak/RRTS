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
    descImages: [{
        type: String
    }],
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"]
    },
    status: {
        type: String,
        enum: ["Not Inspected", "Inspected", "Ongoing", "Completed", "Rejected"],
        default: "Not Inspected"
    },
    priority: {
        type: Number,
        min: 1,
        max: 3,
        default: 3
    },
    feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    estimatedExpense: {
        type: Number,
        min: 0
    },
    estimatedTime: {
        type: Number,
        min: 0
    }
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);

export default Complaint; 