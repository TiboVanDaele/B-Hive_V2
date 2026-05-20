import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);
let db: Db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("gamehub");
        console.log("Connected to MongoDB!");
    } catch (e) {
        console.error(e);
    }
}

export { db, connectToDatabase };