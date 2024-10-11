"use client";

import { useStaffStore } from "../store/staffStore";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  zoom: number;
  handleZoom: (direction: "in" | "out") => void;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  zoom,
  handleZoom,
}: HeaderProps) {
  const { currentStaff, logout } = useStaffStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-3 flex flex-wrap justify-between items-center z-50">
      <h1 className="text-2xl font-bold mr-4">
        CDC Restaurant Point of Sales System
      </h1>
      <div className="flex items-center space-x-4 flex-grow justify-center">
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
          <button
            onClick={() => handleZoom("out")}
            className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
          >
            <MinusIcon className="h-5 w-5 text-white" />
          </button>
          <span className="text-white">{Math.round(zoom * 100) || 0}%</span>
          <button
            onClick={() => handleZoom("in")}
            className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
      {currentStaff && (
        <div className="flex items-center">
          <span className="mr-4">Welcome, {currentStaff.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
