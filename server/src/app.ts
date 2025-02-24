// import dependencies
import express from "express";
import dotenv from "dotenv";

// import custom middleware
import { notFound } from "./middlewares/notFound";

// configure dotenv
dotenv.config();
// get the mongo uri
import { connectDB } from "./db/connect";
const mongoURI: string = process.env.MONGO_URI!;

// import routes
import userRoutes from "./routes/users.route";
import listingRoutes from "./routes/listings.route";

// create express app
const app = express();

// app use
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// routes
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);

app.get("/helloWorld", (req, res) => {
  res.send("Hello World!");
});

app.use(notFound);

// connect to the database
const PORT = 5000;
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
