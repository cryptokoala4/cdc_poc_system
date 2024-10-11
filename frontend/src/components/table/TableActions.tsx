interface TableActionsProps {
  currentOrderId: string | null;
  currentBillId: string | null;
  onCreateOrder: () => void;
  onUpdateOrder: () => void;
  onCreateBill: () => void;
  onPayBill: () => void;
  onCloseTable: () => void;
}

const TableActions = ({
  currentOrderId,
  currentBillId,
  onCreateOrder,
  onUpdateOrder,
  onCreateBill,
  onPayBill,
  onCloseTable,
}: TableActionsProps) => {
  return (
    <div className="space-y-2">
      {!currentOrderId && (
        <button
          onClick={onCreateOrder}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Create Order
        </button>
      )}
      {currentOrderId && (
        <>
          <button
            onClick={onUpdateOrder}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Update Order
          </button>
          {!currentBillId && (
            <button
              onClick={onCreateBill}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Create Bill
            </button>
          )}
        </>
      )}
      {currentBillId && (
        <button
          onClick={onPayBill}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Pay Bill
        </button>
      )}
      <button
        onClick={onCloseTable}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Close Table
      </button>
    </div>
  );
};

export default TableActions;