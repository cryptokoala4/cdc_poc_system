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
import MenuItems from "./MenuItems";
import TableActions from "./TableActions";
import LockedTables from "./LockedTables";
import { MenuItem, OrderItem } from "../../types";
import BillSummary from "../BillSummary";

const TableManagement = () => {
  const { showToast } = useToast();
  const { currentTable, setCurrentTable, tables, fetchTables, unlockTable } =
    useTableStore();
  const { orders, addOrderItem, removeOrderItem, clearOrder, clearAllOrders } =
    useOrderStore();
  const { menuItems, fetchMenuItems } = useMenuStore();
  const { currentStaff } = useStaffStore();

  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentBillId, setCurrentBillId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [createOrder] = useMutation(mutations.CREATE_ORDER);
  const [updateOrder] = useMutation(mutations.UPDATE_ORDER);
  const [settleBill] = useMutation(mutations.SETTLE_BILL);
  const [removeOrderFromBill] = useMutation(mutations.REMOVE_ORDER_FROM_BILL);

  const {
    data: billData,
    loading: billLoading,
    refetch: refetchBill,
  } = useQuery(GET_CURRENT_BILL, {
    variables: { tableId: currentTable },
    skip: !currentTable,
  });

  const getCurrentTableObject = useCallback(() => {
    return tables.find((table) => table._id === currentTable) || null;
  }, [tables, currentTable]);

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, [fetchMenuItems, fetchTables]);

  useEffect(() => {
    if (currentTable) {
      refetchBill();
      clearOrder(currentTable);
      setHasUnsavedChanges(false);
      setCurrentOrderId(null);
      setCurrentBillId(null);
    } else {
      clearAllOrders();
    }
  }, [currentTable, refetchBill, clearOrder, clearAllOrders]);

  useEffect(() => {
    if (billData?.getCurrentBillForTable) {
      const { _id, orders } = billData.getCurrentBillForTable;
      setCurrentBillId(_id);
      const currentOrder = orders[orders.length - 1];
      setCurrentOrderId(currentOrder?._id || null);
      if (currentOrder && currentTable) {
        clearOrder(currentTable);
        currentOrder.items.forEach((item: OrderItem) =>
          addOrderItem(currentTable, item)
        );
      }
    } else {
      setCurrentBillId(null);
      setCurrentOrderId(null);
      if (currentTable) {
        clearOrder(currentTable);
      }
    }
  }, [billData, currentTable, addOrderItem, clearOrder]);

  const handleCloseTable = useCallback(async () => {
    if (!currentTable || !currentStaff) return;
    try {
      const result = await unlockTable(currentTable);
      if (result.success) {
        showToast(result.message, "success");
        await fetchTables();
        setCurrentTable(null);
        setCurrentOrderId(null);
        setCurrentBillId(null);
        clearOrder(currentTable);
      } else {
        showToast(result.message, "error");
      }
    } catch (error: unknown) {
      showToast((error as Error)?.message ?? "Error closing table");
    }
  }, [
    currentTable,
    currentStaff,
    unlockTable,
    fetchTables,
    setCurrentTable,
    showToast,
    clearOrder,
  ]);

  const handleSwitchTable = useCallback(
    async (tableId: string) => {
      if (currentTable === tableId || !currentStaff) return;
      try {
        const result = await setCurrentTable(tableId);
        showToast(result.message, result.success ? "success" : "error");
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Error switching table",
          "error"
        );
      }
    },
    [currentTable, setCurrentTable, currentStaff, showToast]
  );

  const handleCreateOrder = async () => {
    if (!currentTable || !currentStaff) {
      showToast("Cannot create order: no table or staff selected", "error");
      return;
    }

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map(({ _id, quantity, price, name }) => ({
      itemId: _id,
      quantity,
      price,
      name,
    }));

    if (orderItems.length === 0) {
      showToast("Cannot create an empty order", "error");
      return;
    }

    try {
      const { data } = await createOrder({
        variables: {
          createOrderInput: {
            tableId: currentTable,
            items: orderItems,
            username: currentStaff.username,
          },
          username: currentStaff.username,
        },
      });

      if (data.createOrder.success) {
        showToast(data.createOrder.message, "success");
        setCurrentOrderId(data.createOrder.order._id);
        setHasUnsavedChanges(false);
        clearOrder(currentTable);
        await refetchBill();
        await fetchTables();
      } else {
        showToast(data.createOrder.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error creating order",
        "error"
      );
    }
  };

  const handleUpdateOrder = async () => {
    if (!currentOrderId || !currentTable) {
      showToast("No current order to update", "error");
      return;
    }

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map(
      ({ itemId, quantity, price, name }) => ({ itemId, quantity, price, name })
    );

    try {
      const { data } = await updateOrder({
        variables: {
          _id: currentOrderId,
          updateOrderDto: { items: orderItems },
        },
      });

      if (data.updateOrder.success) {
        showToast(data.updateOrder.message, "success");
        setHasUnsavedChanges(false);
        await refetchBill();
      } else {
        showToast(data.updateOrder.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error updating order",
        "error"
      );
    }
  };

  const handlePayBill = async () => {
    if (!currentBillId || !currentTable || !currentStaff) {
      showToast("Cannot pay bill: missing information", "error");
      return;
    }

    try {
      const { data } = await settleBill({ variables: { id: currentBillId } });

      if (data.settleBill.success) {
        showToast(data.settleBill.message, "success");
        setCurrentBillId(null);
        setCurrentOrderId(null);
        setHasUnsavedChanges(false);
        clearOrder(currentTable);
        await unlockTable(currentTable);
        await fetchTables();
        setCurrentTable(null);
        await refetchBill();
      } else {
        showToast(data.settleBill.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error settling bill",
        "error"
      );
    }
  };

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      if (currentTable) {
        const orderItem: OrderItem = {
          _id: item._id,
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        };
        addOrderItem(currentTable, orderItem);
        setHasUnsavedChanges(true);
      }
    },
    [currentTable, addOrderItem]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      if (currentTable) {
        removeOrderItem(currentTable, itemId);
        setHasUnsavedChanges(true);
      }
    },
    [currentTable, removeOrderItem]
  );

  const handleRemoveOrderFromBill = async (orderId: string) => {
    if (!currentBillId) {
      showToast("No active bill to remove order from", "error");
      return;
    }

    try {
      const { data } = await removeOrderFromBill({
        variables: { billId: currentBillId, orderId },
      });

      if (data.removeOrderFromBill.success) {
        showToast(data.removeOrderFromBill.message, "success");
        await refetchBill();
      } else {
        showToast(data.removeOrderFromBill.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Error removing order from bill",
        "error"
      );
    }
  };

  const currentOrder = currentTable ? orders[currentTable] || [] : [];
  const lockedTables = tables.filter((table) => table.lockedBy);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-[85vh] w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
    >
      <div className="w-[65%] p-4 overflow-y-auto">
        <h2 className="font-bold mb-2 text-white text-xl">Menu Items</h2>
        <MenuItems menuItems={menuItems} onAddItem={handleAddItem} />
      </div>
      <div className="w-[35%] bg-gray-800 flex flex-col">
        <div className="p-3 flex-grow overflow-y-auto">
          <h2 className="font-bold mb-3 text-white text-xl">
            Table Management
          </h2>
          <div className="mb-3">
            <h3 className="font-semibold mb-1 text-white text-sm">
              Locked Tables
            </h3>
            <LockedTables
              lockedTables={lockedTables}
              currentTable={currentTable}
              onSwitchTable={handleSwitchTable}
            />
          </div>
          <AnimatePresence>
            {currentTable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-3"
              >
                <h3 className="font-semibold mb-1 text-white text-sm">
                  Current Table: {getCurrentTableObject()?.number || "Unknown"}
                </h3>
                {billLoading ? (
                  <p className="text-gray-400 text-sm">Loading bill...</p>
                ) : (
                  <div className="bg-gray-700 p-1 rounded-lg">
                    <BillSummary
                      bill={billData?.getCurrentBillForTable || null}
                      currentOrder={currentOrder}
                      onRemoveOrder={handleRemoveOrderFromBill}
                      onRemoveItem={handleRemoveItem}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {currentTable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-gray-700"
          >
            <TableActions
              currentOrderId={currentOrderId}
              currentBillId={currentBillId}
              hasItems={currentOrder.length > 0}
              hasUnsavedChanges={hasUnsavedChanges}
              onCreateOrder={handleCreateOrder}
              onUpdateOrder={handleUpdateOrder}
              onPayBill={handlePayBill}
              onCloseTable={handleCloseTable}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TableManagement;
