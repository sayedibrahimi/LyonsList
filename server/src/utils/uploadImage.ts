/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/typedef */
// input is base64 image
// output is url of the image

import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

export default async function hostImage(
  imageBase64: string,
  fileName: string
): Promise<string> {
  try {
    // Environment variables check
    const DO_SPACE_ACCESS_KEY: string | undefined =
      process.env.DO_SPACE_ACCESS_KEY;
    const DO_SPACE_SECRET_KEY: string | undefined =
      process.env.DO_SPACE_SECRET_KEY;
    const DO_SPACE_ENDPOINT: string | undefined = process.env.DO_SPACE_ENDPOINT;
    const DO_SPACE_NAME: string | undefined = process.env.DO_SPACE_NAME;
    const DO_SPACE_REGION: string | undefined = process.env.DO_SPACE_REGION;
    
    if (
      DO_SPACE_ACCESS_KEY === undefined ||
      DO_SPACE_SECRET_KEY === undefined ||
      DO_SPACE_ENDPOINT === undefined ||
      DO_SPACE_NAME === undefined ||
      DO_SPACE_REGION === undefined
    ) {
      console.log("Missing environment variables");
      return "Error";
    }
    
    console.log("Environment variables loaded successfully");
    
    // Extract base64 data - remove the "data:image/jpeg;base64," prefix if present
    let base64Data = imageBase64;
    if (base64Data.includes(';base64,')) {
      base64Data = imageBase64.split(';base64,').pop() || '';
    }
    
    // Convert base64 to binary
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log("Setting up S3 client");
    
    // Fix the endpoint URL format - we need to use the regional endpoint without the bucket name
    // The correct format for DigitalOcean Spaces is: https://nyc3.digitaloceanspaces.com
    const endpointUrl = `https://${DO_SPACE_REGION}.digitaloceanspaces.com`;
    
    // Create S3 client with v3 SDK
    const s3Client = new S3Client({
      endpoint: endpointUrl,
      region: DO_SPACE_REGION,
      credentials: {
        accessKeyId: DO_SPACE_ACCESS_KEY,
        secretAccessKey: DO_SPACE_SECRET_KEY
      }
    });
    
    console.log("Setting up params for upload to:", endpointUrl);
    
    // Create command for uploading object
    const uploadParams = {
      Bucket: DO_SPACE_NAME,
      Key: fileName,
      Body: buffer,
      ACL: ObjectCannedACL.public_read,
      ContentType: "image/jpeg"
    };
    
    console.log("Starting upload");
    
    // Execute the command
    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    
    // Construct the correct URL for the uploaded object
    // Format: https://<bucket>.<region>.digitaloceanspaces.com/<key>
    const imageUrl = `https://${DO_SPACE_NAME}.${DO_SPACE_REGION}.digitaloceanspaces.com/${fileName}`;
    console.log("Image uploaded successfully to:", imageUrl);
    
    return imageUrl;
    
  } catch (error: unknown) {
    console.error("Exception in hostImage:", error);
    if (error instanceof Error) {
      return "Error: " + error.message;
    }
    return "Error: " + String(error);
  }
}