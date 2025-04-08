/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/typedef */
// input is base64 image
// output is url of the image

import * as AWS from "aws-sdk";

export default async function hostImage(
  imageBase64: string,
  fileName: string
): Promise<string> {
  try {
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
      return "Error";
    }
    console.log(
      DO_SPACE_ACCESS_KEY,
      DO_SPACE_ENDPOINT,
      DO_SPACE_NAME,
      DO_SPACE_REGION,
      DO_SPACE_SECRET_KEY
    );

    console.log("setting up endpoing");

    const spacesEndpoint: AWS.Endpoint | undefined = new AWS.Endpoint(
      DO_SPACE_ENDPOINT.replace("https://", "")
    );
    if (!spacesEndpoint) {
      return "Error: spacesEndpoint is undefined";
    }
    console.log("setting up s3");
    const s3: AWS.S3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: DO_SPACE_ACCESS_KEY,
      secretAccessKey: DO_SPACE_SECRET_KEY,
      region: DO_SPACE_REGION,
    });
    console.log("setting up params");
    const params = {
      Bucket: DO_SPACE_NAME,
      Key: fileName,
      Body: imageBase64,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: "images/jpeg",
    };
    console.log("setting up upload");
    s3.upload(params, (err: Error, data: any) => {
      if (err) {
        console.error("Upload failed:", err);
        return err;
      } else {
        console.log("Image uploaded successfully:", data.Location);
        return data.Location;
      }
    });
    return "Image uploaded successfully";
  } catch (error: unknown) {
    return error as string;
  }
}
