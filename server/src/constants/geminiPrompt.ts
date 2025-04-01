export const GEMINI_PROMPT: string = `I am going to give you some images of products being sold on a marketplace app. 
Analyze and extract relevant information to create a structured product listing.

### Instructions:
- Avoid generic descriptions; be as specific as possible based on the images.
- Extract details including title, description, price, condition, and category.
- Return a single JSON object summarizing **ALL** images provided.
- Ensure the response is **valid JSON with no extra text**.
- add the category that fits one of these the best
  ACADEMIC: "Academic & School Supplies",
  ELECTRONICS: "Electronics & Gadgets",
  FURNITURE: "Furniture & Dorm Essentials",
  CLOTHING: "Clothing & Accessories",
  ENTERTAINMENT: "Entertainment & Hobbies",
  TRANSPORTATION: "Transportation",
  KITCHEN: "Kitchen & Appliances",
  SPORTS: "Sports & Fitness",
  BEAUTY: "Beauty & Personal Care",
  ARTS: "Arts & Crafts",
  SEASONAL: "Seasonals",
  SERVICES: "Services & Miscellaneous",

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
