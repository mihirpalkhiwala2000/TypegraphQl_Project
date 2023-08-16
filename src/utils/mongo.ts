import mongoose from "mongoose";
import { logger } from "./logger";

export async function connectToMongo() {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    logger.info("Connected to database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
