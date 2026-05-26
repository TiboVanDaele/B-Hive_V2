import { ObjectId } from "mongodb";

export interface Collection {
    _id?: ObjectId;
    userId: ObjectId;
    name: string;
    games: string[]; // array van slugs
}