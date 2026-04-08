"use client";

import { productService, Product } from "@/app/services/product.service";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Check,
  X,
  Package,
  Truck,
  Layers,
  User,
  Mail,
  Shield,
  Sprout,
  Star,
} from "lucide-react";

interface ProductViewProps {
  productId: string;
}

function lifecycleBadgeClass(status: string) {
  const s = status?.toLowerCase() || "";
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    inactive: "bg-rose-50 text-rose-800 ring-rose-600/20",
    draft: "bg-amber-50 text-amber-900 ring-amber-600/20",
    pending: "bg-sky-50 text-sky-800 ring-sky-600/20",
    rejected: "bg-red-50 text-red-800 ring-red-600/20",
    out_of_stock: "bg-orange-50 text-orange-900 ring-orange-600/20",
    archived: "bg-slate-100 text-slate-700 ring-slate-500/20",
  };
  return map[s] || "bg-slate-100 text-slate-700 ring-slate-500/20";
}

function formatStatus(status: string) {
  return status?.replace(/_/g, " ") || "—";
}

export default function ProductView({ productId }: ProductViewProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token || !productId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(productId, token);
        setProduct(response.data);
        setSelectedImageIndex(0);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  const getImageUrl = (imageName: string) => {
    if (imageName.startsWith("http")) return imageName;
    return `${process.env.NEXT_PUBLIC_S3_DIRECT_URL}/products/${imageName}`;
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!token || !product) return;

    setStatusLoading(true);
    try {
      await productService.updateProductStatus(product._id, newStatus, token);
      setProduct((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Listing status set to ${formatStatus(newStatus)}`);
    } catch (err) {
      console.error("Error updating product status:", err);
      toast.error("Could not update listing status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleApprovalToggle = async () => {
    if (!token || !product) return;
    const next = !product.adminApproved;
    setApprovalLoading(true);
    try {
      await productService.toggleProductApproval(product._id, next, token);
      setProduct((prev) => (prev ? { ...prev, adminApproved: next } : null));
      toast.success(
        next ? "Product approved for catalog" : "Catalog approval removed",
      );
    } catch (err) {
      console.error("Error toggling approval:", err);
      toast.error("Could not update catalog approval.");
    } finally {
      setApprovalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 sm:px-6 max-w-3xl mx-auto py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
          {error || "Product not found"}
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </button>
      </div>
    );
  }

  const orig = Number(product.originalPrice);
  const price = Number(product.price);
  const showCompare = orig > price && orig > 0;
  const images = product.productImages ?? [];
  const tags = product.tags ?? [];
  const seller = product.createdBy;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:divide-x divide-slate-100">
          {/* Gallery */}
          <div className="lg:col-span-2 p-5 lg:p-6 bg-slate-50/50">
            <div className="aspect-square max-h-[min(100vw,420px)] mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
              {images.length > 0 ? (
                <img
                  src={getImageUrl(images[selectedImageIndex] ?? images[0])}
                  alt=""
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  No image
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === index
                        ? "border-emerald-500 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main detail */}
          <div className="lg:col-span-3 p-5 lg:p-8 flex flex-col min-h-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight pr-4">
                {product.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg ring-1 ring-inset ${lifecycleBadgeClass(product.status)}`}
                >
                  {formatStatus(product.status)}
                </span>
                {product.organic && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                    <Sprout className="w-3.5 h-3.5" />
                    Organic
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500 text-white">
                    <Star className="w-3.5 h-3.5" />
                    Featured
                  </span>
                )}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-600 text-white capitalize">
                  {product.productType}
                </span>
              </div>
            </div>

            {/* Moderation — single place for listing + catalog */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Moderation
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <label className="flex-1 min-w-[200px]">
                  <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Listing status
                  </span>
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusLoading}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 disabled:opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="out_of_stock">Out of stock</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleApprovalToggle}
                  disabled={approvalLoading}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0 ${
                    product.adminApproved
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  } disabled:opacity-50`}
                >
                  {product.adminApproved ? (
                    <>
                      <X className="w-4 h-4" />
                      Revoke catalog approval
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Approve for catalog
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Listing status is what sellers and customers see for the product
                lifecycle. Catalog approval controls whether the item is allowed
                in the public catalog.
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-emerald-700">
                  ${price.toFixed(2)}
                </span>
                {showCompare && (
                  <span className="text-lg text-slate-400 line-through">
                    ${orig.toFixed(2)}
                  </span>
                )}
              </div>
              {product.discount > 0 && showCompare && (
                <p className="text-sm text-emerald-700 mt-1">
                  Discount applied
                  {product.discountType === "percentage"
                    ? ` (${product.discount}%)`
                    : ` ($${product.discount})`}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Description
              </h3>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {product.description || "—"}
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-slate-100 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  Category
                </dt>
                <dd className="text-slate-900 font-medium">
                  {product.category?.name || "—"}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  <Package className="w-3.5 h-3.5" />
                  Stock
                </dt>
                <dd className="text-slate-900 font-medium">
                  {product.stockQuantity} units
                </dd>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  Delivery
                </dt>
                <dd className="text-slate-900 font-medium">
                  {product.delivery || "—"}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Product ID
                </dt>
                <dd className="text-slate-600 font-mono text-xs break-all">
                  {product._id}
                </dd>
              </div>
            </dl>

            {tags.length > 0 && (
              <div className="mb-2">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seller */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-6 lg:px-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
            Seller
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <User className="w-3.5 h-3.5" />
                Name
              </div>
              <p className="text-slate-900 font-medium">
                {seller?.firstName || seller?.lastName
                  ? `${seller.firstName || ""} ${seller.lastName || ""}`.trim()
                  : seller?.name || "—"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:col-span-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Mail className="w-3.5 h-3.5" />
                Email
              </div>
              {seller?.email ? (
                <a
                  href={`mailto:${seller.email}`}
                  className="text-emerald-700 font-medium hover:underline break-all"
                >
                  {seller.email}
                </a>
              ) : (
                <p className="text-slate-500">—</p>
              )}
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500 mb-1">Role</div>
              <p className="text-slate-900 font-medium capitalize">
                {seller?.role || "—"}
              </p>
            </div>
            {product.farmName && (
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm lg:col-span-4">
                <div className="text-xs font-medium text-slate-500 mb-1">
                  Farm / shop name
                </div>
                <p className="text-slate-900 font-medium">{product.farmName}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
