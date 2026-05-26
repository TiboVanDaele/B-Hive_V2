import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string;
    username: string;
    xp: number;
    current_game?: {
        slug: string;
        name: string;
        image: string;
    };
}