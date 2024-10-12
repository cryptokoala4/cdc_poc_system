import React from "react";

interface TableActionsProps {
  currentOrderId: string | null;
  currentBillId: string | null;
  hasItems: boolean;
  hasUnsavedChanges: boolean;
  onCreateOrder: () => void;
  onUpdateOrder: () => void;
  onPayBill: () => void;
  onCloseTable: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  currentBillId,
  hasItems,
  hasUnsavedChanges,
  onCreateOrder,
  onUpdateOrder,
  onPayBill,
  onCloseTable,
}) => {
  return (
    <div className="space-y-2">
      {!currentBillId ? (
        <button
          onClick={onCreateOrder}
          disabled={!hasItems}
          className={`w-full py-2 px-4 rounded font-bold ${
            hasItems
              ? "bg-green-500 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Create Order
        </button>
      ) : (
        <>
          <button
            onClick={onUpdateOrder}
            disabled={!hasUnsavedChanges}
            className={`w-full py-2 px-4 rounded font-bold ${
              hasUnsavedChanges
                ? "bg-yellow-500 hover:bg-yellow-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Update Order
          </button>
          <button
            onClick={onPayBill}
            disabled={!hasItems}
            className={`w-full py-2 px-4 rounded font-bold ${
              hasItems
                ? "bg-blue-500 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Pay Bill
          </button>
        </>
      )}
      <button
        onClick={onCloseTable}
        className="w-full py-2 px-4 rounded font-bold bg-red-500 hover:bg-red-700 text-white"
      >
        Unlock Table
      </button>
    </div>
  );
};

export default TableActions;
