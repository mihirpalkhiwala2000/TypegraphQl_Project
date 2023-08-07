import mongoose from "mongoose";

export async function connectToMongo() {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log("Connected to database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
