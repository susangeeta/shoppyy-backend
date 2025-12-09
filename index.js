import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();
connectDB();
const app = express();
const port = 3000;

//body prasing middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to root route");
});

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Allow cross-domain requests (CORS)
app.use(cors());

// ---------------------------------------------
// ROUTE MOUNTING (All routes start with /api/)
// ---------------------------------------------
app.use("/api/", productRoutes);
app.use("/api/", userRoutes);
app.use("/api/", cartRoutes);

// ---------------------------------------------
// GLOBAL ERROR HANDLERS
// ---------------------------------------------
app.use(notFoundHandler);
app.use(globalErrorHandler);

//start server
app.listen(port, () => {
  console.log(`Server Connected At Port: ${port}`);
});

// "userName"="sangeetaswainlucky_db_user"
// "password"="S0nrSPcWho7VU0Eo"
