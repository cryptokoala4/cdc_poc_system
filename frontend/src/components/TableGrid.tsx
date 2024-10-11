"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTableStore } from "../store/tableStore";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import TableManagement from "./table/TableManagement";
import Header from "./Header";

const TableGrid = () => {
  const { tables, fetchTables, setCurrentTable, currentTable, unlockTable } =
    useTableStore();
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTables, setFilteredTables] = useState(tables);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    setFilteredTables(
      tables.filter(
        (table) =>
          table.number.toString().includes(searchTerm) ||
          (table.lockedBy &&
            table.lockedBy.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [tables, searchTerm]);

  const getTableColor = (
    isOccupied: boolean,
    lockedBy: string | null,
    currentBillId: string | null
  ) => {
    if (currentBillId) return "from-red-600 to-red-800";
    if (isOccupied) return "from-purple-600 to-purple-800";
    if (lockedBy) return "from-yellow-500 to-yellow-700";
    return "from-green-600 to-green-800";
  };

  const handleTableClick = async (tableId: string) => {
    if (currentTable === tableId) {
      await unlockTable(tableId);
    } else {
      await setCurrentTable(tableId);
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prevZoom) => {
      const newZoom = direction === "in" ? prevZoom + 0.1 : prevZoom - 0.1;
      return Math.max(0.5, Math.min(newZoom, 1.5));
    });
  };

  return (
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        zoom={zoom}
        handleZoom={handleZoom}
      />
      <div className="min-h-screen bg-gray-900 p-4 pt-20">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          style={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {filteredTables.map((table) => (
            <motion.button
              key={table._id}
              className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center text-white font-bold overflow-hidden shadow-lg relative
                bg-gradient-to-br ${getTableColor(
                  table.isOccupied,
                  table.lockedBy,
                  table.currentBillId
                )}`}
              onClick={() => handleTableClick(table._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl mb-1">Table</span>
              <span className="text-3xl mb-1">{table.number}</span>
              <span className="text-sm mb-2">Seats: {table.seats}</span>
              {table.lockedBy ? (
                <LockClosedIcon className="w-6 h-6" />
              ) : (
                <LockOpenIcon className="w-6 h-6" />
              )}
              {table.lockedBy && (
                <span className="text-xs mt-1">
                  Locked by: {table.lockedBy}
                </span>
              )}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentTable === table._id ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
      <AnimatePresence>
        {currentTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 text-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-4 bg-gray-700">
                <h2 className="text-xl font-bold">Table Management</h2>
                <button
                  onClick={() => setCurrentTable(null)}
                  className="text-4xl hover:text-gray-300"
                >
                  &times;
                </button>
              </div>
              <div className="flex-grow flex overflow-hidden">
                <TableManagement />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableGrid;
