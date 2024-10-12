import { motion } from "framer-motion";
import { Table } from "../../types";

interface LockedTablesProps {
  lockedTables: Table[];
  currentTable: string | null;
  onSwitchTable: (tableId: string) => void;
}

const LockedTables = ({
  lockedTables,
  currentTable,
  onSwitchTable,
}: LockedTablesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {lockedTables.map((table) => (
        <motion.button
          key={table._id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-2 py-1 rounded text-xs font-medium ${
            currentTable === table._id
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
          onClick={() => onSwitchTable(table._id)}
        >
          T{table.number}
        </motion.button>
      ))}
    </div>
  );
};

export default LockedTables;
