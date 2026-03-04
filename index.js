import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Queue } from "bullmq";
import multer from "multer";
import connectToMongoose from "./connection.js";
import File from "./file.js";

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_PATH = process.env.MONGO_PATH;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileQueue = new Queue("file-queue", {
  connection: { host: "127.0.0.1", port: 6379 },
});

async function printDetails(file) {
  const res = await fileQueue.add(file.id, {
    id: file.id,
  });
  console.log(file.id);

  console.log("file uploaded added to queue");
}

app.use(express.json());

app.post("/file-upload", upload.single("uploaded_file"), async (req, res) => {
  const now = new Date().toISOString();
  const file = { ...req.file, id: now + req.file.originalname };
  await File.create(file);
  printDetails(file);
  return res.status(200).json({ msg: "request will be processed shortly" });
});

connectToMongoose(MONGO_PATH)
  .then(() => {
    console.log("database connected");
    app.listen(PORT, () => console.log("server started"));
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
