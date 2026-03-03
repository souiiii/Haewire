import { Queue } from "bullmq";
import { connection } from "./redisConfig.js";

const notificationQueue = new Queue("email-queue", { connection });

async function init() {
  const res = await notificationQueue.add("email to Shahid", {
    emailId: "shahid1redflagged@gmail.com",
    subject: "Welcome Message",
    body: "Hey Shahid, welcome to the team",
  });

  console.log("job added to queue: ", res.id);
}

init();
