import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const MONGODB_URI_STRING = MONGODB_URI as string;

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
if (!global.mongooseCache) {
    global.mongooseCache = cache;
}

export async function connectDB() {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        mongoose.set("strictQuery", false);
        cache.promise = mongoose.connect(MONGODB_URI_STRING);
    }

    cache.conn = await cache.promise;
    return cache.conn;
}

