"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTableStore } from "../../store/tableStore";
import useOrderStore from "../../store/orderStore";
import { useMenuStore } from "../../store/menuStore";
import { useStaffStore } from "../../store/staffStore";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_ORDER,
  UPDATE_ORDER,
  CREATE_BILL,
  UPDATE_BILL,
  REMOVE_ORDER_FROM_BILL,
  UPDATE_TABLE,
  SETTLE_BILL,
} from "../../graphql/mutations";
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

  const [createOrder] = useMutation(CREATE_ORDER);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [createBill] = useMutation(CREATE_BILL);
  const [updateBill] = useMutation(UPDATE_BILL);
  const [removeOrderFromBill] = useMutation(REMOVE_ORDER_FROM_BILL);
  const [updateTable] = useMutation(UPDATE_TABLE);
  const [settleBill] = useMutation(SETTLE_BILL);

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
    if (currentTable) {
      refetchBill();
    }
  }, [currentTable, refetchBill]);

  useEffect(() => {
    if (billData?.getCurrentBillForTable) {
      setCurrentBillId(billData.getCurrentBillForTable._id);
      const currentOrder =
        billData.getCurrentBillForTable.orders[
          billData.getCurrentBillForTable.orders.length - 1
        ];
      if (currentOrder) {
        setCurrentOrderId(currentOrder._id);
      }
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
          if (result.success) {
            showToast(result.message, "success");
          } else {
            showToast(result.message, "error");
          }
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

        if (!currentBillId) {
          await handleCreateBill();
        } else {
          await handleAddOrderToBill(data.createOrder.order._id);
        }
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
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const { data } = await updateOrder({
        variables: {
          _id: currentOrderId,
          updateOrderDto: {
            items: orderItems,
          },
        },
      });

      if (data.updateOrder.success) {
        showToast(data.updateOrder.message, "success");
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

    try {
      const { data } = await createBill({
        variables: {
          createBillInput: {
            tableId: currentTable,
            username: currentStaff.username,
            orderItems: orderItems,
          },
        },
      });

      if (data.createBill.success) {
        showToast(data.createBill.message, "success");
        setCurrentBillId(data.createBill.bill._id);

        await updateTable({
          variables: {
            _id: currentTable,
            isOccupied: true,
            currentBillId: data.createBill.bill._id,
          },
        });

        await refetchBill();
        await fetchTables();
      } else {
        showToast(data.createBill.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error creating bill",
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
      const { data: billData } = await settleBill({
        variables: {
          id: currentBillId,
        },
      });

      if (billData.settleBill.success) {
        showToast(billData.settleBill.message, "success");

        setCurrentBillId(null);
        setCurrentOrderId(null);

        await unlockTable(currentTable);
        await fetchTables();
        setCurrentTable(null);
        await refetchBill();
      } else {
        showToast(billData.settleBill.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error settling bill",
        "error"
      );
    }
  };

  const handleAddOrderToBill = async (orderId: string) => {
    if (!currentBillId) {
      showToast("No active bill to add order to", "error");
      return;
    }

    try {
      const { data } = await updateBill({
        variables: {
          id: currentBillId,
          updateBillInput: {
            orderId: orderId,
          },
        },
      });

      if (data.updateBill.success) {
        showToast(data.updateBill.message, "success");
        await refetchBill();
      } else {
        showToast(data.updateBill.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error adding order to bill",
        "error"
      );
    }
  };

  const handleRemoveOrderFromBill = async (orderId: string) => {
    if (!billData?.getCurrentBillForTable) {
      showToast("No active bill to remove order from", "error");
      return;
    }

    try {
      const { data } = await removeOrderFromBill({
        variables: {
          billId: billData.getCurrentBillForTable._id,
          orderId,
        },
      });

      if (data.removeOrderFromBill.success) {
        showToast(data.removeOrderFromBill.message, "success");
        refetchBill();
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

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      if (currentTable) {
        addOrderItem(currentTable, item);
      }
    },
    [currentTable, addOrderItem]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      if (currentTable) {
        removeOrderItem(currentTable, itemId);
      }
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
      <div className=" w-1/3 lg:w-1/4 bg-gray-800 flex flex-col">
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
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TableManagement;
