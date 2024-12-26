import express from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
}

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;

if (!isProduction) {
  // dynamoose.aws.ddb.local("http://localhost:8000");

  if (!isProduction) {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}
