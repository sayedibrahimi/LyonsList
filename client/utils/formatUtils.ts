// utils/formatUtils.ts

/**
 * Formats a number as a price string with currency symbol
 * @param price The price number to format
 * @param symbol The currency symbol to use (defaults to $)
 * @returns A formatted price string (e.g., "$10.99")
 */
export function formatPrice(price: number, symbol: string = '$'): string {
  return `${symbol}${price.toFixed(2)}`;
}

/**
 * Formats a number with commas for thousands
 * @param num The number to format
 * @returns A formatted number string (e.g., "1,234,567")
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}