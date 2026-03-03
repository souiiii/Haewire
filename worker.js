import { connection } from "./redisConfig.js";
import { Worker } from "bullmq";

const sendEmail = (ms) =>
  new Promise((res, rej) => {
    setTimeout(() => res(), ms);
  });

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Message rec id: ${job.id}`);
    console.log(`Processing message`);
    console.log("Sending email to: ", job.data.emailId);
    await sendEmail(5000);
    console.log("Email sent");
  },
  { connection },
);
