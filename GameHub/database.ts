import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import { User } from "./types/user";
dotenv.config();
import bcrypt from "bcrypt";

const uri = process.env.MONGO_URI;

if(uri === undefined)
    {
        console.error("MONGO_URI moet ingevuld zijn in de env");
        process.exit();
    }

export const client = new MongoClient(uri);
let db: Db;

export const userCollection = client.db("login-B-Hive").collection<User>("users");

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("gamehub");
        console.log("Connected to MongoDB!");
        await createInitialUser();
        process.on("SIGINT", exit);
    } catch (e) {
        console.error(e);
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    const saltRounds : number = 10;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
    });
    console.log("user initialised");
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            console.log("Password incorrect");
            throw new Error("Password incorrect");
        }
    } else {
        console.log("user not found");
        throw new Error("User not found");
    }
}

export { db, connectToDatabase };