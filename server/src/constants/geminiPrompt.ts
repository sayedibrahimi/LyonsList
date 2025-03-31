// export const GEMINI_PROMPT: string = `I am going to give you some images that are products trying to be sold on a marketplace app.
// I want you to analyze and extract relevant information to create a product listing.
// Avoid a generic description and give me specific details about the product in the images.
// Extract information such as the title, description, price, condition, category, and any other relevant details.
// I want the response to be in json format with no extra text. Return only one json response that should summarize ALL images that have been given.
// The json should have the following keys:
//     title: string;
//     description: string;
//     price: number;
//     condition: string ("used" or "new");    `;

export const GEMINI_PROMPT: string = `I am going to give you some images of products being sold on a marketplace app. 
Analyze and extract relevant information to create a structured product listing.

### Instructions:
- Avoid generic descriptions; be as specific as possible based on the images.
- Extract details including title, description, price, condition, and category.
- Return a single JSON object summarizing **ALL** images provided.
- Ensure the response is **valid JSON with no extra text**.

### JSON Format:
\`\`\`json
{
  "title": "string",
  "description": "string",
  "price": number,
  "condition": "new" | "used",
  "category": "string"
}
\`\`\`

Only return the JSON object, with no extra commentary or explanation.`;
