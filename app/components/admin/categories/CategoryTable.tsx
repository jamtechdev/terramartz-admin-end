export type Category = {
  _id: string;
  name: string;
};

type Props = {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
};

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-y-hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm w-full">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-green-700">
            <th className="px-6 py-4 text-left font-semibold text-white">
              Name
            </th>
            <th className="px-6 py-4 text-left font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center text-black py-6">
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((cat, index) => (
              <tr
                key={cat._id}
                className={`transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-green-50`}
              >
                <td className="px-6 py-4 text-gray-700">{cat.name}</td>

                <td className="px-6 py-4 text-gray-700 flex gap-3">
                  <button
                    onClick={() => onEdit(cat)}
                    className="text-blue-600 cursor-pointer"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => onDelete(cat._id)}
                    className="text-red-600 cursor-pointer"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
