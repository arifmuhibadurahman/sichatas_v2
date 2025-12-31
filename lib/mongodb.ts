import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error("Please define MONGODB_URI in .env");
}

// Tambahkan deklarasi global agar tidak error di mode development
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Definisikan clientPromise secara langsung
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Dalam mode development, gunakan variabel global agar koneksi tidak bertambah terus saat refresh
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Dalam mode production, buat koneksi baru
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;