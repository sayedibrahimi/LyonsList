import nodemailer from "nodemailer";
import { MailOptions } from "../types";

interface emailAuth {
  user: string;
  pass: string;
}

function createTransporter(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    } as emailAuth,
  });
}

// test that this works
async function verifyTransporter(
  transporter: nodemailer.Transporter
): Promise<void> {
  return new Promise((resolve, reject) => {
    transporter.verify((error) => {
      if (error) {
        console.error("Email transporter verification failed:", error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function sendOTPemail(messageBody: MailOptions): Promise<void> {
  try {
    const transporter: nodemailer.Transporter = createTransporter();
    await verifyTransporter(transporter);
    await transporter.sendMail(messageBody);
  } catch (error) {
    throw new Error(
      `Email delivery failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export default sendOTPemail;
