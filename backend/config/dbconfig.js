import mongoose from "mongoose";

export const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Only for Atlas/self-signed certs in development
      tls: process.env.MONGO_URI?.startsWith("mongodb+srv") ? true : false,
      tlsAllowInvalidCertificates: process.env.NODE_ENV !== "production",
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting DB:", error);

    process.exit(1);
  }
};
