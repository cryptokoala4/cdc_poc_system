"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTableStore } from "../../store/tableStore";
import useOrderStore from "../../store/orderStore";
import { useMenuStore } from "../../store/menuStore";
import { useStaffStore } from "../../store/staffStore";
import { useMutation, useQuery } from "@apollo/client";
import * as mutations from "../../graphql/mutations";
import { GET_CURRENT_BILL } from "../../graphql/queries";
import { useToast } from "../../hooks/useToast";
import OrderList from "./OrderList";
import MenuItems from "./MenuItems";
import TableActions from "./TableActions";
import LockedTables from "./LockedTables";
import { calculateTotal } from "../../utils/orderUtils";
import { MenuItem } from "../../types";
import BillSummary from "../BillSummary";

const TableManagement = () => {
  const { showToast } = useToast();
  const { currentTable, setCurrentTable, tables, fetchTables, unlockTable } =
    useTableStore();
  const { orders, addOrderItem, removeOrderItem } = useOrderStore();
  const { menuItems, fetchMenuItems } = useMenuStore();
  const { currentStaff } = useStaffStore();
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentBillId, setCurrentBillId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [createOrder] = useMutation(mutations.CREATE_ORDER);
  const [updateOrder] = useMutation(mutations.UPDATE_ORDER);
  const [createBill] = useMutation(mutations.CREATE_BILL);
  const [updateBill] = useMutation(mutations.UPDATE_BILL);
  const [removeOrderFromBill] = useMutation(mutations.REMOVE_ORDER_FROM_BILL);
  const [updateTable] = useMutation(mutations.UPDATE_TABLE);
  const [settleBill] = useMutation(mutations.SETTLE_BILL);

  const {
    data: billData,
    loading: billLoading,
    refetch: refetchBill,
  } = useQuery(GET_CURRENT_BILL, {
    variables: { tableId: currentTable },
    skip: !currentTable,
  });

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, [fetchMenuItems, fetchTables]);

  useEffect(() => {
    if (currentTable) refetchBill();
  }, [currentTable, refetchBill]);

  useEffect(() => {
    if (billData?.getCurrentBillForTable) {
      setCurrentBillId(billData.getCurrentBillForTable._id);
      const currentOrder =
        billData.getCurrentBillForTable.orders[
          billData.getCurrentBillForTable.orders.length - 1
        ];
      setCurrentOrderId(currentOrder ? currentOrder._id : null);
    } else {
      setCurrentBillId(null);
      setCurrentOrderId(null);
    }
  }, [billData]);

  const handleCloseTable = useCallback(async () => {
    if (currentTable && currentStaff) {
      try {
        const result = await unlockTable(currentTable);
        if (result.success) {
          showToast(result.message, "success");
          await fetchTables();
          setCurrentTable(null);
          setCurrentOrderId(null);
          setCurrentBillId(null);
        } else {
          showToast(result.message, "error");
        }
      } catch (error: unknown) {
        showToast((error as Error)?.message ?? "Error closing table");
      }
    }
  }, [
    currentTable,
    currentStaff,
    unlockTable,
    fetchTables,
    setCurrentTable,
    showToast,
  ]);

  const handleSwitchTable = useCallback(
    async (tableId: string) => {
      if (currentTable !== tableId && currentStaff) {
        try {
          const result = await setCurrentTable(tableId);
          showToast(result.message, result.success ? "success" : "error");
        } catch (error) {
          showToast(
            error instanceof Error ? error.message : "Error switching table",
            "error"
          );
        }
      }
    },
    [currentTable, setCurrentTable, currentStaff, showToast]
  );

  const handleMutation = async (
    mutation: any,
    variables: any,
    successMessage: string,
    errorMessage: string
  ) => {
    setIsLoading(true);
    try {
      const { data } = await mutation({ variables });
      const result = data[Object.keys(data)[0]];
      showToast(result.message, result.success ? "success" : "error");
      return result;
    } catch (error) {
      showToast(error instanceof Error ? error.message : errorMessage, "error");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!currentTable || !currentStaff) {
      showToast("Cannot create order: no table or staff selected", "error");
      return;
    }

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    if (orderItems.length === 0) {
      showToast("Cannot create an empty order", "error");
      return;
    }

    const result = await handleMutation(
      createOrder,
      {
        createOrderInput: {
          tableId: currentTable,
          items: orderItems,
          username: currentStaff.username,
        },
        username: currentStaff.username,
      },
      "Order created successfully",
      "Error creating order"
    );

    if (result?.success) {
      setCurrentOrderId(result.order._id);
      if (!currentBillId) {
        await handleCreateBill();
      } else {
        await handleAddOrderToBill(result.order._id);
      }
      await refetchBill();
      await fetchTables();
    }
  };

  const handleUpdateOrder = async () => {
    if (!currentOrderId || !currentTable) {
      showToast("No current order to update", "error");
      return;
    }

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    await handleMutation(
      updateOrder,
      { _id: currentOrderId, updateOrderDto: { items: orderItems } },
      "Order updated successfully",
      "Error updating order"
    );
  };

  const handleCreateBill = async () => {
    if (!currentTable || !currentStaff) {
      showToast("Cannot create bill: no table or staff selected", "error");
      return;
    }

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    if (orderItems.length === 0) {
      showToast("Cannot create a bill without order items", "error");
      return;
    }

    const result = await handleMutation(
      createBill,
      {
        createBillInput: {
          tableId: currentTable,
          username: currentStaff.username,
          orderItems,
        },
      },
      "Bill created successfully",
      "Error creating bill"
    );

    if (result?.success) {
      setCurrentBillId(result.bill._id);
      await updateTable({
        variables: {
          _id: currentTable,
          isOccupied: true,
          currentBillId: result.bill._id,
        },
      });
      await refetchBill();
      await fetchTables();
    }
  };

  const handlePayBill = async () => {
    if (!currentBillId || !currentTable || !currentStaff) {
      showToast("Cannot pay bill: missing information", "error");
      return;
    }

    const result = await handleMutation(
      settleBill,
      { id: currentBillId },
      "Bill settled successfully",
      "Error settling bill"
    );

    if (result?.success) {
      setCurrentBillId(null);
      setCurrentOrderId(null);

      await Promise.all([
        unlockTable(currentTable),
        fetchTables(),
        refetchBill(),
      ]);

      setCurrentTable(null);
    }
  };
  const handleAddOrderToBill = async (orderId: string) => {
    if (!currentBillId) {
      showToast("No active bill to add order to", "error");
      return;
    }

    await handleMutation(
      updateBill,
      { id: currentBillId, updateBillInput: { orderId } },
      "Order added to bill successfully",
      "Error adding order to bill"
    );

    await refetchBill();
  };

  const handleRemoveOrderFromBill = async (orderId: string) => {
    if (!billData?.getCurrentBillForTable) {
      showToast("No active bill to remove order from", "error");
      return;
    }

    await handleMutation(
      removeOrderFromBill,
      { billId: billData.getCurrentBillForTable._id, orderId },
      "Order removed from bill successfully",
      "Error removing order from bill"
    );

    await refetchBill();
  };

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      if (currentTable) addOrderItem(currentTable, item);
    },
    [currentTable, addOrderItem]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      if (currentTable) removeOrderItem(currentTable, itemId);
    },
    [currentTable, removeOrderItem]
  );

  const currentOrder = currentTable ? orders[currentTable] || [] : [];
  const total = calculateTotal(currentOrder);
  const lockedTables = tables.filter((table) => table.lockedBy);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-[85vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
    >
      <div className="w-2/3 lg:w-3/4 p-4 overflow-y-auto">
        <h2 className="font-bold mb-2 text-white text-xl">Menu Items</h2>
        <MenuItems menuItems={menuItems} onAddItem={handleAddItem} />
      </div>
      <div className="w-1/3 lg:w-1/4 bg-gray-800 flex flex-col">
        <div className="p-4 flex-grow overflow-y-auto">
          <h2 className="font-bold mb-3 text-white text-xl">
            Table Management
          </h2>
          <AnimatePresence>
            {currentTable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <h3 className="font-semibold mb-2 text-white text-base">
                  Current Table: {currentTable}
                </h3>
                {billLoading ? (
                  <p className="text-gray-400">Loading bill...</p>
                ) : billData?.getCurrentBillForTable ? (
                  <BillSummary
                    bill={billData.getCurrentBillForTable}
                    onRemoveOrder={handleRemoveOrderFromBill}
                  />
                ) : (
                  <p className="text-gray-400">
                    No active bill for this table.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-white text-base">
              Locked Tables
            </h3>
            <LockedTables
              lockedTables={lockedTables}
              currentTable={currentTable}
              onSwitchTable={handleSwitchTable}
            />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-white text-base">
              Current Order
            </h3>
            <OrderList
              order={currentOrder}
              onRemoveItem={handleRemoveItem}
              total={total}
            />
          </div>
        </div>
        {currentTable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-700"
          >
            <TableActions
              currentOrderId={currentOrderId}
              currentBillId={currentBillId}
              onCreateOrder={handleCreateOrder}
              onUpdateOrder={handleUpdateOrder}
              onCreateBill={handleCreateBill}
              onPayBill={handlePayBill}
              onCloseTable={handleCloseTable}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TableManagement;
