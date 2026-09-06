/**
 * Calculates the discount percentage between price and originalPrice.
 * Parses currency strings like "A$39.99" or numbers.
 *
 * @param {string|number} price
 * @param {string|number} originalPrice
 * @returns {number} Integer discount percentage (e.g. 15 for 15% off)
 */
export function getDiscountPercent(price, originalPrice) {
  if (!price || !originalPrice) return 0;

  const numericPrice =
    typeof price === "number"
      ? price
      : parseFloat(String(price).replace(/[^0-9.]/g, ""));

  const numericOriginalPrice =
    typeof originalPrice === "number"
      ? originalPrice
      : parseFloat(String(originalPrice).replace(/[^0-9.]/g, ""));

  if (
    isNaN(numericPrice) ||
    isNaN(numericOriginalPrice) ||
    numericOriginalPrice <= numericPrice ||
    numericOriginalPrice === 0
  ) {
    return 0;
  }

  return Math.round(
    ((numericOriginalPrice - numericPrice) / numericOriginalPrice) * 100
  );
}
