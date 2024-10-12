"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTableStore } from "../store/tableStore";
import {
  LockClosedIcon,
  LockOpenIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import TableManagement from "./table/TableManagement";
import Header from "./Header";
import { useToast } from "../hooks/useToast";

const TableGrid = () => {
  const { showToast } = useToast();
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
    try {
      if (currentTable === tableId) {
        const result = await unlockTable(tableId);
        if (result.success) {
          showToast(result.message, "success");
        } else {
          showToast(result.message, "error");
        }
      } else {
        const result = await setCurrentTable(tableId);
        if (result.success) {
          showToast(result.message, "success");
        } else {
          showToast(result.message, "error");
        }
      }
    } catch (error: unknown) {
      showToast((error as Error)?.message ?? "Error managing table", "error");
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prevZoom) => {
      const newZoom = direction === "in" ? prevZoom + 0.1 : prevZoom - 0.1;
      return Math.max(0.5, Math.min(newZoom, 1.5));
    });
  };

  useEffect(() => {
    if (currentTable) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [currentTable]);

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
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2"
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
              <span className="text-xs mb-1">Table</span>
              <span className="text-lg mb-1">{table.number}</span>
              <div className="flex flex-wrap justify-center mb-1">
                {[...Array(table.seats)].map((_, index) => (
                  <UserIcon key={index} className="w-3 h-3 text-white mx-0.5" />
                ))}
              </div>
              {table.lockedBy ? (
                <LockClosedIcon className="w-4 h-4" />
              ) : (
                <LockOpenIcon className="w-4 h-4" />
              )}
              {table.lockedBy && (
                <span className="text-[10px] mt-1 truncate w-full px-1">
                  Locked: {table.lockedBy}
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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 sm:px-6 md:px-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 text-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center pl-4 pr-4 pt-2 pb-2 bg-gray-700">
                <h2 className="text-xl font-bold">Table Management</h2>
                <button
                  onClick={() => setCurrentTable(null)}
                  className="text-3xl hover:text-gray-300"
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
