export const GEMINI_PROMPT: string = `I am going to give you some images that are products trying to be sold on a marketplace app. I want you to analyze and extract relevant information to create a product listing. 
Avoid a generic description and give me specific details about the product in the images.
Extract information such as the title, description, price, condition, category, and any other relevant details.
I want the response to be in json format with no extra text. Return only one json response that should summarize ALL images that have been given. 
The json should have the following keys:   
    title: string;
    description: string;
    price: number;
    condition: string ("used" or "new");    `;
