import mongoose from "mongoose";
const Schema = mongoose.Schema;

const supervisorSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: [true, 'Phone number is required'],
    trim: true,
    minlength: [10, 'Phone number must be at least 10 digits']
  },
  pincode: {
    type: Number,
    required: [true, 'Pincode is required'],
    trim: true,
    length: [6, 'Pincode must be exactly 6 digits']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'mayor', 'supervisor'],
    default: 'supervisor'
  },
  feedbacks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  }],
  complaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
}, { timestamps: true });

const Supervisor = mongoose.models.Supervisor || mongoose.model('Supervisor', supervisorSchema);

export default Supervisor; 