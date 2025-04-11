export function geminiPromptTemplate(condition: string = "used"): string {
  return `Analyze the provided product images and identify the product name based on its visual features and context. 
Then: Generate a concise title for the product.
Write a detailed product description with key features, specifications, and any other relevant information.
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

The condition of the product is: ${condition}

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
}
