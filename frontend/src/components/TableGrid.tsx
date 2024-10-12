"use client";

import { useState, useEffect, useCallback } from "react";
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

const getTableSize = (seats: number) => {
  const baseClasses = "col-span-2";
  if (seats <= 2) return `${baseClasses} md:col-span-2`;
  if (seats <= 4) return `${baseClasses} md:col-span-4`;
  return `${baseClasses} md:col-span-6`;
};

const getTableColor = (
  isOccupied: boolean,
  lockedBy: string | null,
  currentBillId: string | null
) => {
  if (currentBillId) return "bg-red-600";
  if (isOccupied) return "bg-purple-600";
  if (lockedBy) return "bg-yellow-500";
  return "bg-green-600";
};

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

  const handleTableClick = useCallback(
    async (tableId: string) => {
      try {
        const action = currentTable === tableId ? unlockTable : setCurrentTable;
        const result = await action(tableId);
        showToast(result.message, result.success ? "success" : "error");
      } catch (error) {
        showToast((error as Error)?.message ?? "Error managing table", "error");
      }
    },
    [currentTable, unlockTable, setCurrentTable, showToast]
  );

  const handleZoom = useCallback((direction: "in" | "out") => {
    setZoom((prevZoom) => {
      const newZoom = direction === "in" ? prevZoom + 0.1 : prevZoom - 0.1;
      return Math.max(0.5, Math.min(newZoom, 1.5));
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = currentTable ? "hidden" : "auto";
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
      <div className="min-h-screen bg-gray-900 p-2 sm:p-4 mt-14 sm:mt-16 flex justify-center">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-12 gap-2 sm:gap-3 md:gap-4 max-w-7xl w-full"
          style={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {filteredTables.map((table) => (
            <motion.button
              key={table._id}
              className={`${getTableSize(
                table.seats
              )} h-24 sm:h-28 md:h-32 rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-white font-bold overflow-hidden shadow-lg relative
                ${getTableColor(
                  table.isOccupied,
                  table.lockedBy,
                  table.currentBillId
                )}`}
              onClick={() => handleTableClick(table._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute top-1 left-1 flex items-center">
                {[...Array(table.seats)].map((_, index) => (
                  <UserIcon
                    key={index}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-0.5"
                  />
                ))}
              </div>
              <div className="absolute top-1 right-1 p-0.5 rounded-full bg-white bg-opacity-20">
                {table.lockedBy ? (
                  <LockClosedIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <LockOpenIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>
              <span className="text-base sm:text-lg md:text-xl font-extrabold mb-1">
                Table {table.number}
              </span>
              <span className="text-xs sm:text-sm font-medium">
                Seats: {table.seats}
              </span>
              {table.lockedBy && (
                <span className="text-[10px] sm:text-xs font-semibold truncate w-full px-2 text-center mt-1">
                  Locked by: {table.lockedBy}
                </span>
              )}
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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-2 sm:px-4 md:px-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 text-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center px-3 py-2 bg-gray-700">
                <h2 className="text-lg sm:text-xl font-bold">
                  Table Management
                </h2>
                <button
                  onClick={() => setCurrentTable(null)}
                  className="text-2xl sm:text-3xl hover:text-gray-300"
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
