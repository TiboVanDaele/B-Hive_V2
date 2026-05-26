import dotenv from "dotenv";
dotenv.config();
import session, { MemoryStore } from "express-session";
import { User } from "./types/user";
import MongoStore from 'connect-mongo'

const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: "sessions",
    collectionName: "login-B-Hive"   
});

mongoStore.on("error", (error) => {
    console.error(error);
});

declare module 'express-session' {
    export interface SessionData {
        user?: User
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "supersecret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});