import express from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import pluralize from "pluralize";
import * as dynamoose from "dynamoose";
import {
  clerkMiddleware,
  createClerkClient,
  requireAuth
} from "@clerk/express";

// ROUTES
import courseRoutes from "./routes/courseRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRouts";

// CONFIG
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(clerkMiddleware()); //protect clerk queries
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/courses", courseRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes); //authentication required, middleware checks it
app.use("/transactions", requireAuth(), transactionRoutes);

const port = process.env.PORT || 3000;

if (!isProduction) {
  // dynamoose.aws.ddb.local("http://localhost:8000");

  if (!isProduction) {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}
