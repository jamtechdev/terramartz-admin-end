"use client";
import { productService, Product } from "@/app/services/product.service";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProductRequests() {
  const { token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequestedProducts = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await productService.getRequestedProducts(token);
      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching requested products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestedProducts();
  }, [token]);

  const handleApprove = async (productId: string) => {
    if (!token) return;
    
    setActionLoading(productId);
    try {
      await productService.approveProduct(productId, token);
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      console.error("Error approving product:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (productId: string) => {
    if (!token) return;
    
    setActionLoading(productId);
    try {
      await productService.rejectProduct(productId, token);
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      console.error("Error rejecting product:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getImageUrl = (imageName: string) => {
    if (imageName.startsWith('http')) {
      return imageName;
    }
    return `${process.env.NEXT_PUBLIC_S3_DIRECT_URL}/products/${imageName}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Approval Requests</h1> */}
        <p className="text-gray-600">Products waiting for admin approval</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products awaiting approval</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-1 border-gray-400">
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
                
                {/* Pending Badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Pending Approval
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
                    className="flex-1 bg-blue-500 text-white  py-1 px-2 rounded text-sm hover:bg-blue-600"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleApprove(product._id)}
                    disabled={actionLoading === product._id}
                    className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                  >
                    {actionLoading === product._id ? 'Loading...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(product._id)}
                    disabled={actionLoading === product._id}
                    className="flex-1 bg-red-500 text-white  py-1 px-2 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                  >
                    {actionLoading === product._id ? 'Loading...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}