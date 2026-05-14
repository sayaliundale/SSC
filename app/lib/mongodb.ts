import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_URI_STRING = MONGODB_URI as string;

function getDatabaseUri() {
    if (!MONGODB_URI_STRING || MONGODB_URI_STRING === "your_mongodb_connection_string") {
        throw new Error("MONGODB_URI is not configured. Set it in .env.local with a valid MongoDB connection string.");
    }
    return MONGODB_URI_STRING;
}

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
        cache.promise = mongoose.connect(getDatabaseUri());
    }

    cache.conn = await cache.promise;
    return cache.conn;
}

