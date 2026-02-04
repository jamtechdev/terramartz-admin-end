"use client";
import { productService, Product, ProductFilters } from "@/app/services/product.service";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const { token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    results: 0
  });

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10
  });

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
        results: response.results
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, token]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }));
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange('page', newPage);
  };

  const getImageUrl = (imageName: string) => {
    // If the image is already a full URL (starts with http), return as is
    if (imageName.startsWith('http')) {
      return imageName;
    }
    // Otherwise, construct the URL with the S3 direct URL from env
    return `${process.env.NEXT_PUBLIC_S3_DIRECT_URL}/products/${imageName}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">Products Management</h1> */}
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />

            {/* Status */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>

            {/* Product Type */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.productType || ''}
              onChange={(e) => handleFilterChange('productType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="regular">Regular</option>
              <option value="organic">Organic</option>
              <option value="premium">Premium</option>
            </select>

            {/* Organic */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.organic?.toString() || ''}
              onChange={(e) => handleFilterChange('organic', e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined)}
            >
              <option value="">All Products</option>
              <option value="true">Organic Only</option>
              <option value="false">Non-Organic</option>
            </select>

            {/* Featured */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.featured?.toString() || ''}
              onChange={(e) => handleFilterChange('featured', e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined)}
            >
              <option value="">All Products</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder="Min Price"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder="Max Price"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />

            {/* Items per page */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.limit || 10}
              onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Showing {pagination.results} of {pagination.total} products
          </p>
          <button
            onClick={() => setFilters({ page: 1, limit: 10 })}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="h-48 bg-gray-200 relative">
                  {product.productImages.length > 0 ? (
                    <img
                      src={getImageUrl(product.productImages[0])}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.organic && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Organic</span>
                    )}
                    {product.featured && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                    )}
                  </div>
                  
                  {/* Status */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' :
                      product.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      product.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                      product.status === 'rejected' ? 'bg-red-200 text-red-900' :
                      product.status === 'out_of_stock' ? 'bg-orange-100 text-orange-800' :
                      product.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  
                  {/* Category */}
                  <p className="text-sm text-gray-500 mb-2">Category: {product.category?.name || 'N/A'}</p>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-green-600">${product.price}</span>
                    {product.originalPrice !== product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  
                  {/* Stock */}
                  <p className="text-sm text-gray-600 mb-2">Stock: {product.stockQuantity}</p>
                  
                  {/* Seller */}
                  <p className="text-sm text-gray-500 mb-3">
                    Seller: {product.createdBy?.email || 'N/A'}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/products/${product._id}`)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600"
                    >
                      View
                    </button>
                    {/* <button
                      onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                      className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600"
                    >
                      Edit
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}