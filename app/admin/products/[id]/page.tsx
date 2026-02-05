"use client";
import ProductView from "@/app/components/admin/products/ProductView";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  return <ProductView productId={id} />;
}