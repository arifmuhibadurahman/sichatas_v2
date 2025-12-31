import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error("Please define MONGODB_URI in .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Simpan client di global (agar tidak reconnect di dev)
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
  console.log("MongoDB client created");
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
