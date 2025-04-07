import { Request, Response, NextFunction } from "express";
import { ControllerError, BadRequestError } from "../errors";
import { sendSuccess } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { geminiPromptTemplate } from "../constants/geminiPrompt";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
  GenerativeModel,
} from "@google/generative-ai";

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // console.log("Request body keys:", Object.keys(req.body));
    
    const { condition, imageData, mimeType = 'image/jpeg' } = req.body;
    
    if (!imageData) {
      throw new BadRequestError("No image data provided.");
    }
    
    // console.log(`Processing image: ${fileName}, data length: ${imageData.length}, type: ${mimeType}`);
    
    // The image is already base64 encoded
    const encodedFiles: string[] = [imageData];
    
    const geminiPrompt: string = geminiPromptTemplate(condition);
    // console.log("Gemini prompt:", geminiPrompt);
    
    try {
      // Use the correct mime type when calling gemini
      let output: string = await geminiResponse(encodedFiles, geminiPrompt, mimeType);
      
      // Clean up the output
      output = output.replace(/```json\n|\n```/g, "");
      // console.log("Processed Gemini output (first 100 chars):", output.substring(0, 100));
      
      const parsedOutput: Record<string, unknown> = JSON.parse(output);
      // console.log("Successfully parsed JSON response");
      sendSuccess(
        res,
        "Image response successfully generated",
        StatusCodes.OK,
        parsedOutput
      );
    } catch (error) {
      // console.error("Gemini API error:", error);
      throw new BadRequestError(
        `Failed to get a valid response from Gemini API: ${error}`
      );
    }
  } catch (error: unknown) {
    // console.log("Error in uploadImageJson:", error);
    ControllerError(error, next);
  }
}

function fileToGenPart(file: string, mimeType: string = 'image/jpeg') {
  // If file already has a data URI prefix, extract just the base64 part
  if (file.startsWith('data:')) {
    const base64Data: string = file.split(',')[1];
    return {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };
  }
  
  // If it's already just the base64 data
  return {
    inlineData: {
      mimeType: mimeType,
      data: file,
    },
  };
}

async function geminiResponse(
  input: string[],
  prompt: string,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  try {
    // Check if the environment variable is set
    const apiKey: string | undefined = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    
    const ai: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey);

    // Get the model
    const model: GenerativeModel = ai.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });
    
    // Convert the images to the format expected by Gemini
    const images: Array<{ inlineData: { mimeType: string; data: string } }> = input.map((file) => fileToGenPart(file, mimeType));
    
    // console.log("Sending request to Gemini API with prompt and images");
    
    // Generate content
    const result: GenerateContentResult = await model.generateContent([
      prompt,
      ...images,
    ]);
    
    // console.log("Received response from Gemini API");
    
    if (!result.response) {
      throw new Error("Empty response from Gemini API");
    }
    
    const text: string = result.response.text();
    // console.log("Extracted text from response");
    
    return text;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // console.error("Gemini API error:", error.message, error.stack);
    } else {
      // console.error("Unknown Gemini API error:", error);
    }
    throw error;
  }
}