/* eslint-disable @typescript-eslint/typedef */
import { Request, Response, NextFunction } from "express";
import { ControllerError, BadRequestError } from "../errors";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { GEMINI_PROMPT } from "../constants/geminiPrompt";
// import axios from "axios";
// import fs from "fs";
// import { GoogleGenAI } from "@google/genai";

import { GoogleGenerativeAI } from "@google/generative-ai";
export const upload: multer.Multer = multer();

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new BadRequestError("No files uploaded.");
    }

    // while loop through req.files until empty, adding each original name to an array
    const encodedFiles: string[] = [];
    let i = 0;
    while (req.files[i]) {
      // Convert the image to Base64
      encodedFiles.push(req.files[i].buffer.toString("base64"));
      i++;
    }

    let output: string = await geminiResponse(encodedFiles);

    // Optional: Save the file temporarily for debugging
    // fs.writeFileSync("debug_image.jpg", req.file.buffer);

    output = output.replace(/```json\n|\n```/g, ""); // Replace escaped newlines with actual newlines

    try {
      const parsedOutput = JSON.parse(output);
      sendSuccess(
        res,
        "Image response successfully generated",
        StatusCodes.OK,
        {
          description: parsedOutput,
        }
      );
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      throw new BadRequestError("Failed to parse JSON response from Gemini.");
    }
  } catch (error: unknown) {
    ControllerError(error, next);
  }
}

function fileToGenPart(file: string, mimType: string) {
  return {
    inlineData: {
      mimeType: mimType,
      data: file,
    },
  };
}

async function geminiResponse(input: string[]): Promise<string> {
  try {
    // Check if the environment variable is set
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    // Check if the API key is valid
    const model = ai.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    if (!model) {
      throw new Error("Failed to initialize the Gemini model.");
    }

    // Check if the input is valid
    const images = input.map((file) => fileToGenPart(file, "image/jpg"));

    // generateContent expects an array of strings, so we need to convert the images to strings
    const result = await model.generateContent([GEMINI_PROMPT, ...images]);

    // Check if the result is valid
    const object = JSON.stringify(
      result,
      (key, value) => {
        if (typeof value === "function") return "[Function]";
        return value;
      },
      2
    );

    // Check if the response is valid
    const ret = JSON.parse(object).response.candidates[0].content.parts[0].text;
    return ret;
  } catch (error: unknown) {
    return `error: ${error}`;
  }
}
