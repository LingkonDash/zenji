import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
// import { getSingleProducts } from "@/lib/product/getSingleProducts";

export async function generateMetadata({ params }) {
  const product = null // await getSingleProducts(params.id);
  if (!product) return { title: "Product not found — Zenji" };
  return {
    title: `${product.title} — Zenji`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const product = null // await getSingleProducts(params.id);
    console.log(product);
    
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary">
      <ProductDetails product={product} />
    </main>
  );
}
