"use client";

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  sold: number;
  stock: number;
  price: number;
  status: "Active" | "Inactive";
};

type TopProductsTableProps = {
  products: readonly Product[];
};


export default function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-green-700">
        Top Selling Products
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700">
              <th className="px-6 py-4 text-left font-semibold text-white">
                Product
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Category
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Sold
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Stock
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Price
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-green-50`}
              >
                {/* Product */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    SKU: {product.sku}
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-gray-700">{product.category}</td>

                {/* Sold */}
                <td className="px-6 py-4 text-gray-700">{product.sold}</td>

                {/* Stock */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
              ${
                product.stock > 20
                  ? "bg-green-100 text-green-700"
                  : product.stock > 0
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
                  >
                    {product.stock} units
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₹{product.price}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
              ${
                product.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
