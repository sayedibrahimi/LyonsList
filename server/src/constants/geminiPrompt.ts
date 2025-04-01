export const GEMINI_PROMPT: string = `Analyze the provided product images and identify the product name based on its visual features and context. 
Then: Generate a concise title for the product.
Write an engaging product description with key features and benefits, allowing flexibility in length but limiting it to a maximum of 1000 characters.
Based on whether the product is new or used (input provided below), provide an estimated price considering market trends for similar products.
Select the most appropriate category from the following list:
- Academic & School Supplies
- Electronics & Gadgets
- Furniture & Dorm Essentials
- Clothing & Accessories
- Entertainment & Hobbies
- Transportation
- Kitchen & Appliances
- Sports & Fitness
- Beauty & Personal Care
- Arts & Crafts
- Seasonals
- Services & Miscellaneous.

The condition of the product is: Used

Return the response in JSON format with the following structure:

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
