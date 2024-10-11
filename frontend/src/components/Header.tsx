"use client";

import { useStaffStore } from "../store/staffStore";

export default function Header() {
  const { currentStaff, logout } = useStaffStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        CDC Restaurant Point of Sales System
      </h1>
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
