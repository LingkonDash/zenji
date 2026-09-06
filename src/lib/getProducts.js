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

  // const baseUrl = process.env.BASEURL

  // const res = await fetch(`${baseUrl}/data/products.json`, {
  //   cache: "force-cache",
  // });

  // if (!res.ok) {
  //   throw new Error(`Failed to fetch products: ${res.status}`);
  // }

  // let products = await res.json();
  let products = await [
  {
    "id": "blue-flame-tee",
    "title": "Blue Flame Tee",
    "collection": "THE_ORIGIN_DROP",
    "description": "Engineered in 240gsm heavyweight cotton with a precision-cut blue flame graphic — a statement of quiet intensity.",
    "price": "A$33.99",
    "originalPrice": "A$39.99",
    "posterImage": "/images/hero/card/Blue-flame.avif",
    "bgImage": "/images/hero/Blue-flame.avif",
    "gallery": [
      "/images/hero/card/Blue-flame.avif",
      "/images/hero/Blue-flame.avif"
    ],
    "colorway": "Electric Blue",
    "inStock": true,
    "sizes": [
      { "label": "XS", "inStock": true },
      { "label": "S", "inStock": true },
      { "label": "M", "inStock": true },
      { "label": "L", "inStock": true },
      { "label": "XL", "inStock": true },
      { "label": "XXL", "inStock": false }
    ],
    "fabricNotes": [
      "240gsm heavyweight cotton",
      "Oversized fit, garment washed",
      "Precision-cut blue flame graphic, front chest",
      "Soft hand-feel with minimal shrinkage",
      "Runs large — size down if between sizes"
    ],
    "sizeGuide": [
      { "size": "XS", "chest": 42, "length": 66, "shoulder": 42 },
      { "size": "S", "chest": 47, "length": 68, "shoulder": 44 },
      { "size": "M", "chest": 52, "length": 70, "shoulder": 46 },
      { "size": "L", "chest": 57, "length": 72, "shoulder": 48 },
      { "size": "XL", "chest": 62, "length": 74, "shoulder": 50 },
      { "size": "XXL", "chest": 67, "length": 76, "shoulder": 52 }
    ],
    "shippingNotes": [
      "Free shipping Australia-wide on orders over A$100",
      "Standard delivery: 3–5 business days",
      "Express delivery: 1–2 business days",
      "Returns accepted within 14 days, unworn"
    ],
    "sku": "ZNJ-BFT-001"
  },
  {
    "id": "demon-blood-tee",
    "title": "Demon Blood Tee",
    "collection": "THE_ORIGIN_DROP",
    "description": "A Japanese warrior motif rendered on an oversized heavyweight silhouette. Strictly limited, no restocks.",
    "price": "A$33.99",
    "originalPrice": "A$39.99",
    "posterImage": "/images/hero/card/Demon-blood.avif",
    "bgImage": "/images/hero/Demon-blood.avif",
    "gallery": [
      "/images/hero/card/Demon-blood.avif",
      "/images/hero/Demon-blood.avif"
    ],
    "colorway": "Crimson Pink",
    "inStock": true,
    "sizes": [
      { "label": "XS", "inStock": true },
      { "label": "S", "inStock": true },
      { "label": "M", "inStock": true },
      { "label": "L", "inStock": true },
      { "label": "XL", "inStock": true },
      { "label": "XXL", "inStock": false }
    ],
    "fabricNotes": [
      "240gsm heavyweight cotton",
      "Oversized fit, garment washed",
      "Anime graphic screenprint, front and back",
      "Runs large — size down if between sizes"
    ],
    "sizeGuide": [
      { "size": "XS", "chest": 42, "length": 66, "shoulder": 42 },
      { "size": "S", "chest": 47, "length": 68, "shoulder": 44 },
      { "size": "M", "chest": 52, "length": 70, "shoulder": 46 },
      { "size": "L", "chest": 57, "length": 72, "shoulder": 48 },
      { "size": "XL", "chest": 62, "length": 74, "shoulder": 50 },
      { "size": "XXL", "chest": 67, "length": 76, "shoulder": 52 }
    ],
    "shippingNotes": [
      "Free shipping Australia-wide on orders over A$100",
      "Standard delivery: 3–5 business days",
      "Express delivery: 1–2 business days",
      "Returns accepted within 14 days, unworn"
    ],
    "sku": "ZNJ-DBM-061"
  },
  {
    "id": "will-of-the-sun-tee",
    "title": "Will Of The Sun Tee",
    "collection": "THE_ORIGIN_DROP",
    "description": "High-contrast graphic composition where technical precision meets street-level conviction.",
    "price": "A$33.99",
    "originalPrice": "A$39.99",
    "posterImage": "/images/hero/card/Will-of-the-sun.avif",
    "bgImage": "/images/hero/Will-of-the-sun.avif",
    "gallery": [
      "/images/hero/card/Will-of-the-sun.avif",
      "/images/hero/Will-of-the-sun.avif"
    ],
    "colorway": "Solar Black",
    "inStock": true,
    "sizes": [
      { "label": "XS", "inStock": true },
      { "label": "S", "inStock": true },
      { "label": "M", "inStock": false },
      { "label": "L", "inStock": true },
      { "label": "XL", "inStock": true },
      { "label": "XXL", "inStock": true }
    ],
    "fabricNotes": [
      "240gsm heavyweight cotton",
      "Oversized boxy silhouette",
      "High-contrast dual-layer screenprint",
      "Pre-shrunk and garment dyed",
      "True to size with intentional room"
    ],
    "sizeGuide": [
      { "size": "XS", "chest": 42, "length": 66, "shoulder": 42 },
      { "size": "S", "chest": 47, "length": 68, "shoulder": 44 },
      { "size": "M", "chest": 52, "length": 70, "shoulder": 46 },
      { "size": "L", "chest": 57, "length": 72, "shoulder": 48 },
      { "size": "XL", "chest": 62, "length": 74, "shoulder": 50 },
      { "size": "XXL", "chest": 67, "length": 76, "shoulder": 52 }
    ],
    "shippingNotes": [
      "Free shipping Australia-wide on orders over A$100",
      "Standard delivery: 3–5 business days",
      "Express delivery: 1–2 business days",
      "Returns accepted within 14 days, unworn"
    ],
    "sku": "ZNJ-WOS-014"
  },
  {
    "id": "warrior-spirit-tee",
    "title": "Warrior Spirit Tee",
    "collection": "THE_ORIGIN_DROP",
    "description": "Samurai discipline etched into 100% heavyweight cotton — built for those who move with purpose. Restrained front typography paired with a high-impact reverse graphic. Subtlety meets presence.",
    "price": "A$30.99",
    "originalPrice": "A$39.99",
    "posterImage": "/images/hero/card/Warrior-spirit.avif",
    "bgImage": "/images/hero/Warrior-spirit.avif",
    "gallery": [
      "/images/hero/card/Warrior-spirit.avif",
      "/images/hero/Warrior-spirit.avif"
    ],
    "colorway": "Shadow Grey",
    "inStock": true,
    "sizes": [
      { "label": "XS", "inStock": false },
      { "label": "S", "inStock": true },
      { "label": "M", "inStock": true },
      { "label": "L", "inStock": true },
      { "label": "XL", "inStock": true },
      { "label": "XXL", "inStock": true }
    ],
    "fabricNotes": [
      "240gsm 100% heavyweight cotton",
      "Oversized fit with dropped shoulders",
      "Restrained front typography + full reverse graphic",
      "Garment washed for broken-in feel",
      "Runs large — size down if between sizes"
    ],
    "sizeGuide": [
      { "size": "XS", "chest": 42, "length": 66, "shoulder": 42 },
      { "size": "M", "chest": 52, "length": 70, "shoulder": 46 },
      { "size": "S", "chest": 47, "length": 68, "shoulder": 44 },
      { "size": "L", "chest": 57, "length": 72, "shoulder": 48 },
      { "size": "XL", "chest": 62, "length": 74, "shoulder": 50 },
      { "size": "XXL", "chest": 67, "length": 76, "shoulder": 52 }
    ],
    "shippingNotes": [
      "Free shipping Australia-wide on orders over A$100",
      "Standard delivery: 3–5 business days",
      "Express delivery: 1–2 business days",
      "Returns accepted within 14 days, unworn"
    ],
    "sku": "ZNJ-WSP-027"
  },
  {
    "id": "bushido-tee",
    "title": "Bushido Tee",
    "collection": "THE_ORIGIN_DROP",
    "description": "Restrained front typography paired with a high-impact reverse graphic. Subtlety meets presence.",
    "price": "A$39.99",
    "originalPrice": "A$39.99",
    "posterImage": "/images/hero/card/Bushido.avif",
    "bgImage": "/images/hero/Bushido.avif",
    "gallery": [
      "/images/hero/card/Bushido.avif",
      "/images/hero/Bushido.avif"
    ],
    "colorway": "Ink Black",
    "inStock": true,
    "sizes": [
      { "label": "XS", "inStock": true },
      { "label": "S", "inStock": true },
      { "label": "M", "inStock": true },
      { "label": "L", "inStock": false },
      { "label": "XL", "inStock": true },
      { "label": "XXL", "inStock": true }
    ],
    "fabricNotes": [
      "240gsm heavyweight cotton",
      "Relaxed oversized silhouette",
      "Minimal front print with large reverse graphic",
      "Softened hand-feel after garment wash",
      "True to size with intentional drape"
    ],
    "sizeGuide": [
      { "size": "XS", "chest": 42, "length": 66, "shoulder": 42 },
      { "size": "S", "chest": 47, "length": 68, "shoulder": 44 },
      { "size": "M", "chest": 52, "length": 70, "shoulder": 46 },
      { "size": "L", "chest": 57, "length": 72, "shoulder": 48 },
      { "size": "XL", "chest": 62, "length": 74, "shoulder": 50 },
      { "size": "XXL", "chest": 67, "length": 76, "shoulder": 52 }
    ],
    "shippingNotes": [
      "Free shipping Australia-wide on orders over A$100",
      "Standard delivery: 3–5 business days",
      "Express delivery: 1–2 business days",
      "Returns accepted within 14 days, unworn"
    ],
    "sku": "ZNJ-BSH-033"
  },
  {
    "id": "domain-expansion-tee",
    "title": "Domain Expansion Tee",
    "collection": "THE_ORIGIN_DROP",
    "description": "An archival-grade anime graphic piece — once the allocation clears, it's gone.",
    "price": "A$39.99",
    "originalPrice": "A$39.99",
    "posterImage": "/images/hero/card/Domain-expansion.avif",
    "bgImage": "/images/hero/Domain-expansion.avif",
    "gallery": [
      "/images/hero/card/Domain-expansion.avif",
      "/images/hero/Domain-expansion.avif"
    ],
    "colorway": "Void Purple",
    "inStock": true,
    "sizes": [
      { "label": "XS", "inStock": true },
      { "label": "S", "inStock": true },
      { "label": "M", "inStock": true },
      { "label": "L", "inStock": true },
      { "label": "XL", "inStock": false },
      { "label": "XXL", "inStock": false }
    ],
    "fabricNotes": [
      "240gsm archival heavyweight cotton",
      "Oversized fit, limited allocation",
      "Multi-layer anime graphic screenprint",
      "Strictly limited — no restocks planned",
      "Runs large — size down if between sizes"
    ],
    "sizeGuide": [
      { "size": "XS", "chest": 42, "length": 66, "shoulder": 42 },
      { "size": "S", "chest": 47, "length": 68, "shoulder": 44 },
      { "size": "M", "chest": 52, "length": 70, "shoulder": 46 },
      { "size": "L", "chest": 57, "length": 72, "shoulder": 48 },
      { "size": "XL", "chest": 62, "length": 74, "shoulder": 50 },
      { "size": "XXL", "chest": 67, "length": 76, "shoulder": 52 }
    ],
    "shippingNotes": [
      "Free shipping Australia-wide on orders over A$100",
      "Standard delivery: 3–5 business days",
      "Express delivery: 1–2 business days",
      "Returns accepted within 14 days, unworn"
    ],
    "sku": "ZNJ-DEX-049"
  },
  {
    "id": "water-breathing-tee",
    "title": "Water Breathing Tee",
    "collection": "THE_ORIGIN_DROP",
    "description": "Fluid Japanese iconography distilled into a dark, contemplative silhouette.",
    "price": "A$39.99",
    "originalPrice": "A$39.99",
    "posterImage": "/images/hero/card/Water-breathing.avif",
    "bgImage": "/images/hero/Water-breathing.avif",
    "gallery": [
      "/images/hero/card/Water-breathing.avif",
      "/images/hero/Water-breathing.avif"
    ],
    "colorway": "Deep Ocean",
    "inStock": true,
    "sizes": [
      { "label": "XS", "inStock": true },
      { "label": "S", "inStock": true },
      { "label": "M", "inStock": true },
      { "label": "L", "inStock": true },
      { "label": "XL", "inStock": true },
      { "label": "XXL", "inStock": true }
    ],
    "fabricNotes": [
      "240gsm heavyweight cotton",
      "Relaxed oversized fit",
      "Fluid Japanese iconography print",
      "Garment washed for soft hand-feel",
      "True to size with clean drape"
    ],
    "sizeGuide": [
      { "size": "XS", "chest": 42, "length": 66, "shoulder": 42 },
      { "size": "S", "chest": 47, "length": 68, "shoulder": 44 },
      { "size": "M", "chest": 52, "length": 70, "shoulder": 46 },
      { "size": "L", "chest": 57, "length": 72, "shoulder": 48 },
      { "size": "XL", "chest": 62, "length": 74, "shoulder": 50 },
      { "size": "XXL", "chest": 67, "length": 76, "shoulder": 52 }
    ],
    "shippingNotes": [
      "Free shipping Australia-wide on orders over A$100",
      "Standard delivery: 3–5 business days",
      "Express delivery: 1–2 business days",
      "Returns accepted within 14 days, unworn"
    ],
    "sku": "ZNJ-WBR-055"
  }
];

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
    if (searchTerm !== "all") {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          (p.description && p.description.toLowerCase().includes(searchTerm)) ||
          (p.collection && p.collection.toLowerCase().includes(searchTerm))
      );
    }
  }

  return products;
}

