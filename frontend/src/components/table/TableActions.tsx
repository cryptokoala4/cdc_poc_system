interface TableActionsProps {
  currentOrderId: string | null;
  currentBillId: string | null;
  onCreateOrder: () => void;
  onUpdateOrder: () => void;
  onCreateBill: () => void;
  onPayBill: () => void;
  onCloseTable: () => void;
  isLoading: boolean;
}

const TableActions = ({
  currentOrderId,
  currentBillId,
  onCreateOrder,
  onUpdateOrder,
  onCreateBill,
  onPayBill,
  onCloseTable,
  isLoading,
}: TableActionsProps) => {
  return (
    <div className="space-y-2">
      {!currentBillId ? (
        <>
          <button
            onClick={onCreateBill}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          >
            {currentOrderId ? "New Order" : "Create Bill"}
          </button>
          {currentOrderId && (
            <>
              {/* <button
                onClick={onUpdateOrder}
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
              >
                Update Order 1111
              </button> */}
              {/* <button
                onClick={onCreateBill}
                disabled={isLoading}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
              >
                Create Bill
              </button> */}
            </>
          )}
        </>
      ) : (
        <>
          <button
            onClick={onUpdateOrder}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          >
            Update Order 22222
          </button>
          <button
            onClick={onPayBill}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          >
            Pay Bill
          </button>
        </>
      )}
      <button
        onClick={onCloseTable}
        disabled={isLoading}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
      >
        Unlock Table
      </button>
    </div>
  );
};

export default TableActions;
