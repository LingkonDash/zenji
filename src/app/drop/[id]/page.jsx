import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import { getProductById } from "@/lib/product/getProductById";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found — Zenji" };
  return {
    title: `${product.title} — Zenji`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary">
      <ProductDetails product={product} />
    </main>
  );
}

