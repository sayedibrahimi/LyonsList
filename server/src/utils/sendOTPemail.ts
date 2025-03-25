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
    messageBody.html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #4285f4; margin: 20px 0;">
        ${messageBody.data}
        </div>
        <p style="font-size: 14px; color: #777;">This OTP will expire in 10 minutes.</p>
      </div>
      `;
    await transporter.sendMail(messageBody);
  } catch (error) {
    throw new Error(
      `Email delivery failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export default sendOTPemail;
