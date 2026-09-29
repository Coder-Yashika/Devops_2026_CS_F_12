import mongoose from 'mongoose';

// Connects to MongoDB using the URI from .env.
// We keep this in its own file so server.js stays focused on wiring things
// together rather than dealing with connection details/retries.
export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    // Exit the process - there's no point running an API that can't reach its DB
    process.exit(1);
  }
}
