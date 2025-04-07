import nodemailer from "nodemailer";
import { MailOptions, FeedbackForm } from "../types";
import ReportForm from "../types/ReportForm";
import { ControllerError } from "../errors";
import { NextFunction } from "express";

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

export async function sendEmailOTP(
  messageBody: MailOptions<string>,
  next: NextFunction
): Promise<void> {
  try {
    const transporter: nodemailer.Transporter = createTransporter();
    await verifyTransporter(transporter);
    messageBody.html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">2-Factor Authentication Request</h2>
        <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #4285f4; margin: 20px 0;">
        ${messageBody.data}
        </div>
        <p style="font-size: 14px; color: #777;">This OTP will expire in 10 minutes.</p>
      </div>
      `;
    await transporter.sendMail(messageBody);
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function sendEmailFeedback(
  messageBody: MailOptions<FeedbackForm>,
  next: NextFunction
): Promise<void> {
  try {
    const transporter: nodemailer.Transporter = createTransporter();
    await verifyTransporter(transporter);
    let header: string = `<h2 style="color: #333;">New User Feedback Received</h2>`;
    if (messageBody.data.issue) {
      header = `<h2 style="color: #900;">Issue Reported!</h2>`;
    }
    messageBody.html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        ${header}
        <p style="font-size: 16px; color: #555;"><strong>Name:</strong> ${messageBody.data.firstName} ${messageBody.data.lastName}</p>
        <p style="font-size: 16px; color: #555;"><strong>Email:</strong> ${messageBody.data.email}</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <p style="font-size: 16px; color: #333;"><strong>Message:</strong></p>
          <p style="font-size: 15px; color: #555; white-space: pre-wrap;">${messageBody.data.message}</p>
        </div>
        <p style="font-size: 13px; color: #aaa; margin-top: 30px;">This message was sent through the feedback form on your app.</p>
      </div>
    `;
    await transporter.sendMail(messageBody);
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

export async function sendEmailReport(
  messageBody: MailOptions<ReportForm>,
  next: NextFunction
): Promise<void> {
  try {
    const transporter: nodemailer.Transporter = createTransporter();
    await verifyTransporter(transporter);
    const reportData: ReportForm = messageBody.data;
    messageBody.html = `
  <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #d9534f; margin: 0; padding: 0;">Listing Report Notification</h2>
      <p style="color: #6c757d; font-size: 14px; margin-top: 5px;">Filed on ${reportData.createdAt}</p>
    </div>
    
    <!-- Listing Information -->
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px; display: flex;">
      <div style="flex: 1;">
        <h3 style="color: #333; margin-top: 0; margin-bottom: 10px;">${reportData.listingData.title}</h3>
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 5px;">Price: $${reportData.listingData.price.toFixed(2)} • Condition: ${reportData.listingData.condition}</p>
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 5px;">Category: ${reportData.listingData.category}</p>
        <p style="color: #888; font-size: 13px; margin-top: 5px; margin-bottom: 0;">Listing ID: ${reportData.listingID}</p>
      </div>
    </div>
    
    <!-- Report Details -->
    <div style="margin-bottom: 20px;">
      <h4 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Report Details</h4>
      <div style="padding: 0 10px;">
        <p style="font-size: 15px; color: #555; margin-bottom: 8px;"><strong>Report Category:</strong> ${reportData.category}</p>
        ${reportData.message ? `<p style="font-size: 15px; color: #555; margin-bottom: 8px;"><strong>Additional Details:</strong> ${reportData.message}</p>` : ""}
      </div>
    </div>
    
    <!-- User Information -->
    <div style="display: flex; margin-bottom: 15px;">
      <!-- Reporter Information -->
      <div style="flex: 1; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-right: 10px;">
        <h4 style="color: #333; margin-top: 0; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Reporter</h4>
        <p style="font-size: 14px; color: #555; margin-bottom: 5px;"><strong>Name:</strong> ${reportData.reporterData.firstName} ${reportData.reporterData.lastName}</p>
        <p style="font-size: 14px; color: #555; margin-bottom: 5px;"><strong>Email:</strong> ${reportData.reporterData.email}</p>
        <p style="font-size: 12px; color: #888; margin-bottom: 0;"><strong>ID:</strong> ${reportData.reporterData.userID}</p>
      </div>
      
      <!-- Seller Information -->
      <div style="flex: 1; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-left: 10px;">
        <h4 style="color: #333; margin-top: 0; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">Seller</h4>
        <p style="font-size: 14px; color: #555; margin-bottom: 5px;"><strong>Name:</strong> ${reportData.sellerData.firstName} ${reportData.sellerData.lastName}</p>
        <p style="font-size: 14px; color: #555; margin-bottom: 5px;"><strong>Email:</strong> ${reportData.sellerData.email}</p>
        <p style="font-size: 12px; color: #888; margin-bottom: 0;"><strong>ID:</strong> ${reportData.sellerData.userID}</p>
      </div>
    </div>
    
    <!-- Admin Action Notice -->
    <div style="background-color: #e8f4f8; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
      <p style="color: #0c5460; font-size: 14px; margin: 0;">
        <strong>Note:</strong> This report requires administrator review. Please take appropriate action through the admin dashboard.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
      <p style="color: #6c757d; font-size: 12px; margin-bottom: 5px;">This is an automated email. Please do not reply.</p>
      <p style="color: #6c757d; font-size: 12px; margin-top: 0;">Wheaton Marketplace © ${new Date().getFullYear()}</p>
    </div>
  </div>
  `;
    await transporter.sendMail(messageBody);
  } catch (error) {
    ControllerError(error, next);
  }
}
