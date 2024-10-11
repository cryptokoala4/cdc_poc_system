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
    <div className="grid grid-cols-2 gap-2">
      {lockedTables.map((table) => (
        <motion.button
          key={table._id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg text-white text-center ${
            currentTable === table._id ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => onSwitchTable(table._id)}
        >
          Table {table.number}
        </motion.button>
      ))}
    </div>
  );
};

export default LockedTables;
