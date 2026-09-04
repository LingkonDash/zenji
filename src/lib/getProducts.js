/**
 * getProducts — single fetch function for product data.
 *
 * Reads from /data/products.json in the public folder.
 * Accepts optional query/searchParams object to filter results.
 *
 * @param {Object} [queryObj] - Filter options { category, q }
 * @returns {Promise<Array>} Resolves to the filtered products array.
 */
export async function getProducts(queryObj = {}) {
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

  let products = await res.json();

  const { category, q } = queryObj || {};

  // Filter by category if specified
  if (category && category !== "all") {
    const cat = category.toLowerCase();
    if (cat === "sale") {
      products = products.filter(
        (p) => p.price && p.originalPrice && p.price !== p.originalPrice
      );
    } else if (cat === "new_arrival") {
      products = products.slice(0, 4);
    } else if (cat === "limited") {
      products = products.filter((p) =>
        `${p.title} ${p.description}`.toLowerCase().includes("limited")
      );
    } else if (cat === "zangetsu") {
      products = products.filter((p) =>
        `${p.title} ${p.description}`.toLowerCase().includes("zangetsu") ||
        `${p.title} ${p.description}`.toLowerCase().includes("blade") ||
        `${p.title} ${p.description}`.toLowerCase().includes("demon")
      );
    } else {
      products = products.filter((p) =>
        p.collection?.toLowerCase() === cat ||
        `${p.title} ${p.description}`.toLowerCase().includes(cat)
      );
    }
  }

  // Filter by search term q
  if (q && typeof q === "string" && q.trim() !== "") {
    const searchTerm = q.trim().toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
    );
  }

  return products;
}

