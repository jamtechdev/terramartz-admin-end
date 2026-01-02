export type Category = {
  _id: string;
  name: string;
};

type Props = {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
};

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
    <table className="w-full bg-white rounded shadow">
      <thead>
        <tr className="border-b">
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {categories.map((cat) => (
          <tr key={cat._id} className="border-b">
            <td className="p-3">{cat.name}</td>

            <td className="p-3 text-right space-x-3">
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
        ))}
      </tbody>
    </table>
    
    </>
  );
}
