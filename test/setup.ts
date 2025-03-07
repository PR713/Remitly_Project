import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { server } from "../src";

let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();

    server.close();
});
