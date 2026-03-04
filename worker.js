import dotenv from "dotenv";
dotenv.config();
import connectToMongoose from "./connection.js";
import File from "./file.js";
import { Worker } from "bullmq";

const MONGO_PATH = process.env.MONGO_PATH;

connectToMongoose(MONGO_PATH)
  .then(() => console.log("worker database connected"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
// const sendEmail = (ms) =>
//   new Promise((res, rej) => {
//     setTimeout(() => res(), ms);
//   });

// const worker = new Worker(
//   "email-queue",
//   async (job) => {
//     console.log(`Message rec id: ${job.id}`);
//     console.log(`Processing message`);
//     console.log("Sending email to: ", job.data.emailId);
//     await sendEmail(5000);
//     console.log("Email sent");
//   },
//   { connection },
// );

async function fetchFile(id) {
  const file = await File.findOne({ id: id }).lean();
  return new Promise((res, rej) => {
    setTimeout(async () => {
      res(file);
    }, 2000);
  });
}

const worker = new Worker(
  "file-queue",
  async (job) => {
    console.log("Processing file");
    const id = job.data.id;
    console.log(id);
    const file = await fetchFile(id);
    console.log("Printing file details: \n");
    console.log(file);
  },
  {
    connection: { host: "127.0.0.1", port: 6379 },
  },
);
