import { MongoClient } from "mongodb";

const uri = "mongodb://fixmate-backend-db:3UKprbwltcvBJb1G@ac-5o0pdtc-shard-00-00.kawiou8.mongodb.net:27017,ac-5o0pdtc-shard-00-01.kawiou8.mongodb.net:27017,ac-5o0pdtc-shard-00-02.kawiou8.mongodb.net:27017/?ssl=true&replicaSet=atlas-bacqjm-shard-0&authSource=admin";
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db("fixmate");
  const ratedBookings = await db.collection("bookings").find({ rating: { $exists: true } }).toArray();
  console.log("Rated bookings count:", ratedBookings.length);
  if (ratedBookings.length > 0) {
    console.log("Sample rating/review:", JSON.stringify(ratedBookings[0], null, 2));
  }
  const services = await db.collection("services").find().limit(2).toArray();
  console.log("Sample service:", JSON.stringify(services[0], null, 2));
  await client.close();
}

run().catch(console.error);
