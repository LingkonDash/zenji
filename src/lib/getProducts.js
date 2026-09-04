/**
 * getProducts — single fetch function for product data.
 *
 * Reads from /data/products.json in the public folder.
 * Use this everywhere products are needed; never duplicate or hardcode product data.
 *
 * Works in Next.js Server Components (async page/layout) and in regular
 * server-side contexts. The `cache: "force-cache"` option tells Next.js to
 * dedupe and cache the request at build/request time automatically.
 *
 * @returns {Promise<Array>} Resolves to the full products array.
 */
export async function getProducts() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/data/products.json`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  return res.json();
}
