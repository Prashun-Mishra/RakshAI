import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongoose = global as typeof globalThis & { mongoose?: MongooseCache };
const cached = globalForMongoose.mongoose ?? (globalForMongoose.mongoose = { conn: null, promise: null });

export async function connectToDatabase() {
  const databaseUri = process.env.MONGODB_URI;
  if (!databaseUri) throw new Error("MONGODB_URI is not configured. Add it to your environment variables.");
  if (cached.conn) return cached.conn;

  cached.promise ??= mongoose.connect(databaseUri, { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}
