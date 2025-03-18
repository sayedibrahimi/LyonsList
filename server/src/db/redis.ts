import { createClient, RedisClientType } from "redis";

// Define redis client type
let redisClient: RedisClientType | null = null;

/**
 * Initialize the Redis client
 */
export async function initRedisClient(): Promise<void> {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
}

/**
 * Get the Redis client instance
 * @returns The Redis client or throws an error if not initialized
 */
export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call initRedisClient first");
  }
  return redisClient;
}

/**
 * Close the Redis connection
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("Redis connection closed");
  }
}
