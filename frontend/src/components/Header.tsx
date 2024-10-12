"use client";

import { useStaffStore } from "../store/staffStore";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  zoom?: number;
  handleZoom?: (direction: "in" | "out") => void;
}

export default function Header({
  searchTerm = "",
  setSearchTerm = () => {},
  zoom = 1,
  handleZoom = () => {},
}: HeaderProps) {
  const { currentStaff, logout } = useStaffStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-2 h-12 sm:h-14 md:h-18 flex items-center justify-between z-50">
      <h1 className="font-bold mr-4 text-sm sm:text-base">
        CDC Restaurant POS
      </h1>
      <div className="hidden md:flex items-center space-x-4 flex-grow justify-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tables..."
            className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          {["out", "in"].map((direction) => (
            <button
              key={direction}
              onClick={() => handleZoom(direction as "in" | "out")}
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
            >
              {direction === "out" ? (
                <MinusIcon className="h-5 w-5 text-white" />
              ) : (
                <PlusIcon className="h-5 w-5 text-white" />
              )}
            </button>
          ))}
          <span className="text-white">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
      {currentStaff && (
        <div className="flex items-center">
          <span className="mr-4 text-sm sm:text-base hidden sm:inline">
            Welcome, {currentStaff.name}
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 sm:px-4 rounded text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
