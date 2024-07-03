import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Return a 405 Method Not Allowed if not a GET request
  }

  // Connection URL to your MongoDB database
  const url = "mongodb://127.0.0.1:27017/Fyp"; // Replace with your MongoDB connection string

  // Database and collection names
  const dbName = "Fyp"; // Replace with your database name
  const collectionName = "booking";

  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch data from the MongoDB collection
    const data = await collection.find({}).toArray();

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).end();
  } finally {
    client.close(); // Close the MongoDB client connection
  }
}
