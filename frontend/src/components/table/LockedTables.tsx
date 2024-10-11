import { Table } from "../../types";

interface LockedTablesProps {
  lockedTables: Table[];
  currentTable: string | null;
  onSwitchTable: (tableId: string) => void;
}

const LockedTables = ({ lockedTables, currentTable, onSwitchTable }: LockedTablesProps) => {
  const getButtonClass = (tableId: string) =>
    `px-4 py-2 rounded ${
      currentTable === tableId
        ? "bg-blue-600 text-white"
        : "bg-gray-300 text-gray-800 hover:bg-gray-400"
    }`;

  return (
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Locked Tables</h3>
      {lockedTables.length === 0 ? (
        <p className="text-gray-500">No tables are currently locked.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {lockedTables.map((table) => (
            <li key={table._id}>
              <button
                onClick={() => onSwitchTable(table._id)}
                className={getButtonClass(table._id)}
              >
                Table {table.number}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default LockedTables;