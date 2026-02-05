"use client";
import { productService, Product } from "@/app/services/product.service";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProductViewProps {
  productId: string;
}

export default function ProductView({ productId }: ProductViewProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token || !productId) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(productId, token);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  const getImageUrl = (imageName: string) => {
    // If the image is already a full URL (starts with http), return as is
    if (imageName.startsWith('http')) {
      return imageName;
    }
    // Otherwise, construct the URL with the S3 direct URL from env
    return `${process.env.NEXT_PUBLIC_S3_DIRECT_URL}/products/${imageName}`;
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!token || !product) return;
    
    setStatusLoading(true);
    try {
      await productService.updateProductStatus(product._id, newStatus, token);
      setProduct(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error("Error updating product status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex mb-6">
        <button
          onClick={() => router.back()}
          className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          ← Back to Products
        </button>
        {/* <button
          onClick={() => router.push(`/admin/products/${product._id}/edit`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Edit Product
        </button> */}
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-lg mb-4">
              {product.productImages.length > 0 ? (
                <img
                  src={getImageUrl(product.productImages[selectedImageIndex])}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg cursor-pointer border-1 border-gray-400"
                  onClick={() => {
                    const nextIndex = (selectedImageIndex + 1) % product.productImages.length;
                    setSelectedImageIndex(nextIndex);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.productImages.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${product.title} ${index + 1}`}
                    className={`w-full h-20 object-cover rounded cursor-pointer border-2 transition ${
                      selectedImageIndex === index ? 'border-green-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.status === 'active' ? 'bg-green-100 text-green-800' :
                product.status === 'inactive' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {product.status}
              </span>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.organic && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Organic</span>
              )}
              {product.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">Featured</span>
              )}
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">{product.productType}</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-green-600">${product.price}</span>
                {product.originalPrice !== product.price && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.discount > 0 && (
                <p className="text-sm text-green-600">
                  Save ${product.discountType === 'percentage' ? 
                    ((product.originalPrice * product.discount) / 100).toFixed(2) : 
                    product.discount}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900">Category</h4>
                <p className="text-gray-600">{product.category.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Stock Quantity</h4>
                <p className="text-gray-600">{product.stockQuantity} units</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Delivery</h4>
                <p className="text-gray-600">{product.delivery}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Status</h4>
                <select
                  value={product.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={statusLoading}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seller Information */}
        <div className="border-t bg-gray-50 p-6">
          <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Name</h4>
              <p className="text-gray-600">
                {product.createdBy?.firstName && product.createdBy?.lastName 
                  ? `${product.createdBy.firstName} ${product.createdBy.lastName}`
                  : 'N/A'
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Email</h4>
              <p className="text-gray-600">{product.createdBy.email}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Role</h4>
              <p className="text-gray-600">{product.createdBy.role}</p>
            </div>
            {product.farmName && (
              <div>
                <h4 className="font-medium text-gray-900">Farm Name</h4>
                <p className="text-gray-600">{product.farmName}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}