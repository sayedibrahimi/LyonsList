// import dependencies
import express from "express";
import dotenv from "dotenv";

// import custom middleware
import { notFound } from "./middlewares/notFound";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";

// configure dotenv
dotenv.config();
// get the mongo uri
import { connectDB } from "./db/connect";
const mongoURI: string = process.env.MONGO_URI!;

// import routes
import auth from "./middlewares/auth";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/users.route";
import listingRoutes from "./routes/listings.route";

// create express app
const app = express();

// app use
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// app.use("/listings", auth, listingRoutes);

app.get("/helloWorld", (req, res) => {
  res.send("Hello World!");
});

// if none of the routes match, return a 404
app.use(notFound);
// app.use(errorHandlerMiddleware);

// connect to the database
const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    // async connect to db, then run on server
    await connectDB(mongoURI);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
  }
};

start();
