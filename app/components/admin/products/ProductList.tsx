"use client";

import { productService, Product, ProductFilters } from "@/app/services/product.service";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  RotateCcw,
  Eye,
  Check,
  X,
  Star,
} from "lucide-react";

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

function sellerStatusLabel(status: string) {
  return status?.toLowerCase() === "active" ? "Active" : "Inactive";
}

export default function ProductList() {
  const { token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerOptions, setSellerOptions] = useState<
    Array<{ _id: string; name: string; email: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [featuredLoadingId, setFeaturedLoadingId] = useState<string | null>(
    null,
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    results: 0,
  });

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
  });

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.search) n++;
    if (filters.sellerId) n++;
    if (filters.status) n++;
    if (filters.productType) n++;
    if (filters.organic !== undefined && filters.organic !== null) n++;
    if (filters.adminApproved !== undefined && filters.adminApproved !== null) n++;
    if (filters.featured !== undefined && filters.featured !== null) n++;
    if (filters.minPrice != null) n++;
    if (filters.maxPrice != null) n++;
    return n;
  }, [filters]);

  const fetchProducts = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await productService.getProducts(filters, token);
      setProducts(response.products);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        results: response.results,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Could not load products. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, token]);

  useEffect(() => {
    const fetchSellers = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?role=seller&page=1&limit=200`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );
        const data = await res.json();
        if (!res.ok || !Array.isArray(data?.users)) return;
        const sellers = data.users
          .map((u: any) => ({
            _id: String(u._id || ""),
            name: String(u.name || "").trim(),
            email: String(u.email || "").trim(),
          }))
          .filter((u: { _id: string }) => Boolean(u._id));
        setSellerOptions(sellers);
      } catch (error) {
        console.error("Error fetching seller options:", error);
      }
    };

    fetchSellers();
  }, [token]);

  const handleFilterChange = (key: keyof ProductFilters, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    }));
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange("page", newPage);
  };

  const getImageUrl = (imageName: string) => {
    if (imageName.startsWith("http")) return imageName;
    return `${process.env.NEXT_PUBLIC_S3_DIRECT_URL}/products/${imageName}`;
  };

  const handleExportCSV = async () => {
    if (!token) return;

    try {
      const blob = await productService.exportProductsCSV(token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Export started — check your downloads.");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Export failed.");
    }
  };

  const handleToggleApproval = async (
    productId: string,
    currentApproved: boolean,
  ) => {
    if (!token) return;

    try {
      await productService.toggleProductApproval(
        productId,
        !currentApproved,
        token,
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, adminApproved: !currentApproved }
            : product,
        ),
      );
      toast.success(
        !currentApproved
          ? "Product approved for catalog"
          : "Approval removed",
      );
    } catch (error: any) {
      console.error("Error toggling approval:", error);
      const apiMessage = error?.response?.data?.message || error?.message;
      const denied = /full access to the products module/i.test(
        String(apiMessage || ""),
      );
      toast.error(
        denied
          ? "Access denied: you need Full Products permission to approve or revoke catalog approval."
          : apiMessage || "Could not update approval.",
      );
    }
  };

  const handleToggleFeatured = async (
    productId: string,
    currentFeatured: boolean,
  ) => {
    if (!token) return;

    setFeaturedLoadingId(productId);
    try {
      await productService.updateProductFeatured(
        productId,
        !currentFeatured,
        token,
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, featured: !currentFeatured }
            : product,
        ),
      );
      toast.success(
        !currentFeatured
          ? "Product marked as featured"
          : "Product removed from featured",
      );
    } catch (error: unknown) {
      console.error("Error toggling featured:", error);
      const err = error as { response?: { data?: { message?: string } } };
      const apiMessage = err?.response?.data?.message || (error as Error)?.message;
      const denied = /full access to the products module/i.test(
        String(apiMessage || ""),
      );
      toast.error(
        denied
          ? "Access denied: you need Full Products permission to change featured."
          : apiMessage || "Could not update featured flag.",
      );
    } finally {
      setFeaturedLoadingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-[1680px] mx-auto">
      {/* Primary toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
        <div className="relative w-full lg:max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by title, description…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            {filtersOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilters({ page: 1, limit: 10 })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Collapsible filters */}
      {filtersOpen && (
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 sm:p-5 mb-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">
            Refine results
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Seller
              </span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.sellerId || ""}
                onChange={(e) =>
                  handleFilterChange("sellerId", e.target.value || undefined)
                }
              >
                <option value="">All sellers</option>
                {sellerOptions.map((seller) => (
                  <option key={seller._id} value={seller._id}>
                    {seller.name || seller.email} {seller.email ? `(${seller.email})` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Listing status
              </span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="out_of_stock">Out of stock</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Product type
              </span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.productType || ""}
                onChange={(e) =>
                  handleFilterChange("productType", e.target.value)
                }
              >
                <option value="">All</option>
                <option value="regular">Regular</option>
                <option value="organic">Organic</option>
                <option value="premium">Premium</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Organic
              </span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.organic?.toString() || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "organic",
                    e.target.value === "true"
                      ? true
                      : e.target.value === "false"
                        ? false
                        : undefined,
                  )
                }
              >
                <option value="">Any</option>
                <option value="true">Organic only</option>
                <option value="false">Non-organic</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Catalog approval
              </span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.adminApproved?.toString() || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "adminApproved",
                    e.target.value === "true"
                      ? true
                      : e.target.value === "false"
                        ? false
                        : undefined,
                  )
                }
              >
                <option value="">All</option>
                <option value="true">Approved</option>
                <option value="false">Not approved</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Featured
              </span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.featured?.toString() || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "featured",
                    e.target.value === "true"
                      ? true
                      : e.target.value === "false"
                        ? false
                        : undefined,
                  )
                }
              >
                <option value="">Any</option>
                <option value="true">Featured</option>
                <option value="false">Not featured</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Min price ($)
              </span>
              <input
                type="number"
                min={0}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Max price ($)
              </span>
              <input
                type="number"
                min={0}
                placeholder="—"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 mb-1.5 block">
                Per page
              </span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                value={filters.limit || 10}
                onChange={(e) =>
                  handleFilterChange("limit", Number(e.target.value))
                }
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">
            {pagination.results}
          </span>
          <span className="text-slate-500"> of </span>
          <span className="font-semibold text-slate-900">
            {pagination.total}
          </span>
          <span className="text-slate-500"> products</span>
        </p>
        <p className="text-slate-500">
          Page {pagination.page} / {totalPages}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading products…</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-slate-500">
          No products match these filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {products.map((product) => {
              const orig = Number(product.originalPrice);
              const price = Number(product.price);
              const showCompare =
                orig > price && orig > 0;

              return (
                <article
                  key={product._id}
                  className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md hover:border-slate-300/90"
                >
                  <div className="relative h-44 bg-slate-100 shrink-0">
                    {product.productImages?.length > 0 ? (
                      <img
                        src={getImageUrl(product.productImages[0])}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No image
                      </div>
                    )}
                    <div className="absolute top-2 left-2 right-2 flex items-start gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg shadow-sm ${product.adminApproved ? "bg-white/95 text-emerald-800 ring-1 ring-emerald-600/20" : "bg-amber-50 text-amber-900 ring-1 ring-amber-600/25"}`}
                      >
                        {product.adminApproved ? "Approved" : "Rejected"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg ring-1 ring-inset shrink-0 ml-auto ${lifecycleBadgeClass(product.status)}`}
                      >
                        {sellerStatusLabel(product.status)}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                      {product.organic && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm">
                          Organic
                        </span>
                      )}
                      {product.featured && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-4 pt-3">
                    <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description || "—"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>
                        <span className="text-slate-400">Category · </span>
                        {product.category?.name || "—"}
                      </span>
                      <span>
                        <span className="text-slate-400">Stock · </span>
                        {product.stockQuantity}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                      <span className="text-lg font-bold text-emerald-700">
                        ${price.toFixed(2)}
                      </span>
                      {showCompare && (
                        <span className="text-sm text-slate-400 line-through">
                          ${orig.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs text-slate-400 mt-1 truncate"
                      title={product.createdBy?.email}
                    >
                      Seller · {product.createdBy?.email || "—"}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      <span className="text-slate-400">Featured · </span>
                      <span className="font-medium tabular-nums">
                        {product.featured ? "Yes" : "No"}
                      </span>
                    </p>

                    <div className="mt-auto pt-4 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/admin/products/${product._id}`)
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleApproval(
                              product._id,
                              product.adminApproved || false,
                            )
                          }
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium text-white ${
                            product.adminApproved
                              ? "bg-rose-600 hover:bg-rose-700"
                              : "bg-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          {product.adminApproved ? (
                            <>
                              <X className="w-4 h-4" />
                              Revoke
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={featuredLoadingId === product._id}
                        onClick={() =>
                          handleToggleFeatured(
                            product._id,
                            Boolean(product.featured),
                          )
                        }
                        className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 disabled:pointer-events-none ${
                          product.featured
                            ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 shrink-0 ${
                            product.featured
                              ? "fill-amber-500 text-amber-600"
                              : "text-slate-400"
                          }`}
                        />
                        {featuredLoadingId === product._id
                          ? "Saving…"
                          : product.featured
                            ? "Remove featured"
                            : "Mark featured"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {pagination.total > pagination.limit && (
            <nav
              className="flex justify-center items-center gap-2 mt-10"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 tabular-nums">
                {pagination.page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
