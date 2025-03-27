// import dependencies
import express from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";

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
// import userRoutes from "./routes/admin.users.route";
import userAccountRoutes from "./routes/user.route";
import listingRoutes from "./routes/listings.route";
import favoriteRoutes from "./routes/favorites.route";
import uploadRoutes from "./routes/upload.route";
// import OTPRoutes from "./routes/otp.route";

// Create base API router
const apiRouter: express.Router = express.Router();

// create express app
const app: express.Application = express();

// app use
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// routes
const API_BASE_PATH: string | undefined = process.env.API_BASE_PATH;
if (!API_BASE_PATH) {
  throw new Error("API_BASE_PATH is not defined");
}
app.use(API_BASE_PATH, apiRouter);

// Mount all routes to the API router
apiRouter.use("/auth", authRoutes);
// apiRouter.use("/users", userRoutes);
apiRouter.use("/account", auth, userAccountRoutes);
apiRouter.use("/listings", auth, listingRoutes);
apiRouter.use("/favorites", auth, favoriteRoutes);
apiRouter.use("/upload", uploadRoutes);
// apiRouter.use("/otp", OTPRoutes);

app.use(notFound);
app.use(errorHandlerMiddleware);

// connect to the database
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const start: () => Promise<void> = async () => {
  try {
    // async connect to db, then run on server
    await connectDB(mongoURI);
    console.log("Connected to the database");

    // start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error: unknown) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

// start the server
start();
