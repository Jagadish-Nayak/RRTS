import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  dob: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
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
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  complaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
  feedbacks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'mayor', 'supervisor'],
    default: 'user'
  }
}, { timestamps: true });

// Pre-save middleware to hash password before saving
// UserSchema.pre('save', async function(next) {
//   // Only hash the password if it's modified (or new)
//   if (!this.isModified('password')) return next();
  
//   try {
//     // Generate salt
//     const salt = await bcrypt.genSalt(10);
//     // Hash password with salt
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Method to compare password for login
// UserSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Method to generate verification token
// UserSchema.methods.generateVerificationToken = function() {
//   // Generate a random token
//   this.verifyToken = Math.random().toString(36).substring(2, 15) + 
//                      Math.random().toString(36).substring(2, 15);
  
//   // Set token expiry to 24 hours from now
//   this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
//   return this.verifyToken;
// };

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User; 