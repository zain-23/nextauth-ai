import mongoose, { Connection } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log(`Already connected to database`);
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log(`DB Connection failed ${error}`);
    process.exit();
  }
};
