import bcrypt from "bcryptjs";

export async function hashData(data: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
}

export async function verifyHashedData(
  data: string,
  hashedData: string
): Promise<boolean> {
  const match: boolean = await bcrypt.compare(data, hashedData);
  return match;
}
