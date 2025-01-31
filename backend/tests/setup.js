import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import redis from "@jest-mock/redis";


jest.mock("redis", () => redis);


let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  (await import("redis")).mock.reset();
});