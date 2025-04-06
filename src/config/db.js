// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     return conn;
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB; 

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
