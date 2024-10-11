"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTableStore } from "../../store/tableStore";
import useOrderStore from "../../store/orderStore";
import { useMenuStore } from "../../store/menuStore";
import { useStaffStore } from "../../store/staffStore";
import { useTableLock } from "../../hooks/useTableLock";
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

import OrderList from "./OrderList";
import MenuItems from "./MenuItems";
import TableActions from "./TableActions";
import LockedTables from "./LockedTables";
import { calculateTotal } from "../../utils/orderUtils";
import { MenuItem } from "../../types";
import BillSummary from "../BillSummary";

const TableManagement = () => {
  const { currentTable, setCurrentTable, tables, fetchTables } =
    useTableStore();
  const { orders, addOrderItem, removeOrderItem } = useOrderStore();
  const { menuItems, fetchMenuItems } = useMenuStore();
  const { currentStaff } = useStaffStore();
  const { lockTable, unlockTable } = useTableLock();
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
        await unlockTable(currentTable, currentStaff.username);
        await fetchTables();
        setCurrentTable(null);
        setCurrentOrderId(null);
        setCurrentBillId(null);
      } catch (error) {
        console.error("Error closing table:", error);
      }
    }
  }, [currentTable, currentStaff, unlockTable, fetchTables, setCurrentTable]);

  const handleSwitchTable = useCallback(
    async (tableId: string) => {
      if (currentTable !== tableId && currentStaff) {
        try {
          await setCurrentTable(tableId);
          if (tableId) {
            await lockTable(tableId, currentStaff.username);
          }
        } catch (error) {
          console.error("Error switching table:", error);
        }
      }
    },
    [currentTable, setCurrentTable, lockTable, currentStaff]
  );

  const handleCreateOrder = async () => {
    if (!currentTable || !currentStaff) {
      console.error(
        "Cannot create order: currentTable or currentStaff is null"
      );
      return;
    }

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    if (orderItems.length === 0) {
      console.error("Cannot create an empty order");
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
      setCurrentOrderId(data.createOrder.order._id);

      if (!currentBillId) {
        await handleCreateBill();
      } else {
        await handleAddOrderToBill(data.createOrder.order._id);
      }
      await refetchBill();
      await fetchTables();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleUpdateOrder = async () => {
    if (!currentOrderId || !currentTable) return;

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
        console.log("Order updated successfully");
      } else {
        console.error("Failed to update order:", data.updateOrder.message);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleCreateBill = async () => {
    if (!currentTable || !currentStaff) return;

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    if (orderItems.length === 0) {
      console.error("Cannot create a bill without order items");
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
        console.error("Failed to create bill:", data.createBill.message);
      }
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  const handlePayBill = async () => {
    if (!currentBillId || !currentTable || !currentStaff) return;
    try {
      const { data: billData } = await settleBill({
        variables: {
          id: currentBillId,
        },
      });

      if (billData.settleBill.success) {
        console.log("Bill settled successfully");

        setCurrentBillId(null);
        setCurrentOrderId(null);

        await unlockTable(currentTable, currentStaff.username);
        await fetchTables();
        setCurrentTable(null);
        await refetchBill();
      } else {
        console.error("Failed to settle bill:", billData.settleBill.message);
      }
    } catch (error) {
      console.error("Error settling bill:", error);
    }
  };

  const handleAddOrderToBill = async (orderId: string) => {
    if (!currentBillId) return;

    try {
      await updateBill({
        variables: {
          id: currentBillId,
          updateBillInput: {
            orderId: orderId,
          },
        },
      });
      await refetchBill();
    } catch (error) {
      console.error("Error adding order to bill:", error);
    }
  };

  const handleRemoveOrderFromBill = async (orderId: string) => {
    if (!billData?.getCurrentBillForTable) return;

    try {
      const { data } = await removeOrderFromBill({
        variables: {
          billId: billData.getCurrentBillForTable._id,
          orderId,
        },
      });

      if (data.removeOrderFromBill.success) {
        console.log("Order removed from bill successfully");
        refetchBill();
      } else {
        console.error(
          "Failed to remove order from bill:",
          data.removeOrderFromBill.message
        );
      }
    } catch (error) {
      console.error("Error removing order from bill:", error);
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
      <div className="w-2/3 p-6 overflow-y-auto">
        <h2 className=" font-bold mb-4 text-white">Menu Items</h2>
        <MenuItems menuItems={menuItems} onAddItem={handleAddItem} />
      </div>
      <div className="w-1/3 bg-gray-800 flex flex-col">
        <div className="p-6 flex-grow overflow-y-auto">
          <h2 className=" font-bold mb-4 text-white">Table Management</h2>
          <AnimatePresence>
            {currentTable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <h3 className=" font-semibold mb-2 text-white">
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
          <div className="mb-6">
            <h3 className=" font-semibold mb-2 text-white">Locked Tables</h3>
            <LockedTables
              lockedTables={lockedTables}
              currentTable={currentTable}
              onSwitchTable={handleSwitchTable}
            />
          </div>
          <div className="mb-6">
            <h3 className=" font-semibold mb-2 text-white">Current Order</h3>
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
            className="p-6 bg-gray-700"
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
