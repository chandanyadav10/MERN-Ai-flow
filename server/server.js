
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import fetch from "node-fetch";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.SITE_URL || "http://localhost:5173",
credentials: true 

}));
app.use(express.json());

const PORT = process.env.PORT || 5000;


const loadRoutes = async () => {
  const routeFiles = fs.readdirSync("./src/routes");
  for (const file of routeFiles) {
    try {
      const { default: router } = await import(`./src/routes/${file}`);
      app.use("/api/", router);
    } catch (error) {
      console.error(`Error loading route file ${file}:`, error);
    }
  }
};

await loadRoutes();

const Server = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }

};

Server();
