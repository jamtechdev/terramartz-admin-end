"use client";

type Product = {
  name: string;
  sold: number;
  stock: number;
};

type TopProductsTableProps = {
  products: Product[];
};

export default function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-green-700">Top Selling Products</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Product</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Sold</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name} className="border-b hover:bg-green-50 transition-colors">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.sold}</td>
              <td className="py-2 px-4">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
