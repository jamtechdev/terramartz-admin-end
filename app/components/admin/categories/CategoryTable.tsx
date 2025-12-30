/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  categories: { id: string; name: string }[];
  onEdit: (cat: any) => void;
  onDelete: (id: string) => void;
};

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
  return (
    <table className="w-full bg-white rounded shadow">
      <thead>
        <tr className="border-b">
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat.id} className="border-b">
            <td className="p-3">{cat.name}</td>
            <td className="p-3 text-right space-x-3">
              <button onClick={() => onEdit(cat)} className="text-blue-600">
                ✏️
              </button>
              <button onClick={() => onDelete(cat.id)} className="text-red-600">
                🗑
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
