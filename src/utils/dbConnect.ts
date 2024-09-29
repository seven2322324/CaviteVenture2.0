import mongoose, { ConnectOptions } from 'mongoose';

// Define a new type for the mongoose connection cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object in Node.js to handle caching (for development environments)
declare global {
  // Allow global `var` to be used across different modules in a Node.js environment
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Ensure that the MongoDB URI is available from the environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Use a global variable to cache the mongoose connection
let cached = global.mongoose;

// Initialize the cache if it's not already set
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// The function that connects to MongoDB, ensuring the connection is cached
const dbConnect = async (): Promise<typeof mongoose> => {
  // Return the existing connection if it's already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise exists, create a new connection and cache it
  if (!cached.promise) {
    const options: ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering in development
    };

    // Connect to MongoDB and store the promise in the cache
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => mongoose);
  }

  // Wait for the connection to be established and store it in the cache
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
