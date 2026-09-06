import { getProducts } from "@/lib/getProducts";

/**
 * getProductById — fetches a single product by its id from local data.
 *
 * @param {string} id - Product ID to search for.
 * @returns {Promise<Object|null>} Resolves to the product object or null if not found.
 */
export async function getProductById(id) {
  if (!id) return null;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  return product || null;
}
