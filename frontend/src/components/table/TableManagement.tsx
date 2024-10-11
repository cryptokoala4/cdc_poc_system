"use client";

import { useEffect, useCallback, useState } from "react";
import { useTableStore } from "../../store/tableStore";
import useOrderStore from "../../store/orderStore";
import { useMenuStore } from "../../store/menuStore";
import { useStaffStore } from "../../store/staffStore";
import { useTableLock } from "../../hooks/useTableLock";
import { useMutation } from "@apollo/client";
import {
  CREATE_ORDER,
  UPDATE_ORDER,
  CREATE_BILL,
  UPDATE_BILL,
} from "../../graphql/mutations";
import OrderList from "./OrderList";
import MenuItems from "./MenuItems";
import TableActions from "./TableActions";
import LockedTables from "./LockedTables";
import { calculateTotal } from "../../utils/orderUtils";
import { MenuItem, OrderItem } from "../../types";

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

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, [fetchMenuItems, fetchTables]);

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
        // TODO: implement toastbox for error handling
      }
    }
  }, [currentTable, currentStaff, unlockTable, fetchTables, setCurrentTable]);

  const handleSwitchTable = useCallback(
    async (tableId: number) => {
      if (currentTable !== tableId && currentStaff) {
        try {
          await setCurrentTable(tableId);
          if (tableId) {
            await lockTable(tableId, currentStaff.username);
            // TODO: Fetch current order and bill for this table
            // and update currentOrderId and currentBillId accordingly
          }
        } catch (error) {
          console.error("Error switching table:", error);
          // TODO: implement toastbox for error handling
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
    }));

    console.log("Creating order with:", {
      tableId: currentTable,
      username: currentStaff.username,
      items: orderItems,
    });

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
      console.log("Order created successfully:", data);
      setCurrentOrderId(data.createOrder.order._id);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.graphQLErrors) {
        console.error("GraphQL errors:", error.graphQLErrors);
      }
      if (error.networkError) {
        console.error("Network error:", error.networkError);
      }
      // TODO: implement toastbox for error handling
    }
  };

  useEffect(() => {
  }, [currentStaff]);

  const handleUpdateOrder = async () => {
    if (!currentOrderId || !currentTable) return;

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
    }));

    try {
      await updateOrder({
        variables: {
          updateOrderInput: {
            orderId: currentOrderId,
            items: orderItems,
          },
        },
      });
    } catch (error) {
      console.error("Error updating order:", error);
      // TODO: implement toastbox for error handling
    }
  };

  const handleCreateBill = async () => {
    if (!currentOrderId || !currentTable || !currentStaff) return;

    try {
      const { data } = await createBill({
        variables: {
          createBillInput: {
            orderId: currentOrderId,
            tableId: currentTable,
            username: currentStaff.username,
          },
        },
      });
      setCurrentBillId(data.createBill._id);
    } catch (error) {
      console.error("Error creating bill:", error);
      // TODO: implement toastbox for error handling
    }
  };

  const handlePayBill = async () => {
    if (!currentBillId) return;

    try {
      await updateBill({
        variables: {
          updateBillInput: {
            billId: currentBillId,
            status: "PAID",
          },
        },
      });
      setCurrentBillId(null);
      setCurrentOrderId(null);
    } catch (error) {
      console.error("Error paying bill:", error);
      // TODO: implement toastbox for error handling
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
    (itemId: number) => {
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
    <div className="flex h-[75vh]">
      <div className="w-2/3 p-4 overflow-y-auto bg-gray-800">
        <MenuItems menuItems={menuItems} onAddItem={handleAddItem} />
      </div>
      <div className="w-1/3 p-4 border-l border-gray-600 flex flex-col bg-gray-800">
        <LockedTables
          lockedTables={lockedTables}
          currentTable={currentTable}
          onSwitchTable={handleSwitchTable}
        />
        {currentTable && (
          <>
            <OrderList
              order={currentOrder}
              onRemoveItem={handleRemoveItem}
              total={total}
            />
            <TableActions
              currentOrderId={currentOrderId}
              currentBillId={currentBillId}
              onCreateOrder={handleCreateOrder}
              onUpdateOrder={handleUpdateOrder}
              onCreateBill={handleCreateBill}
              onPayBill={handlePayBill}
              onCloseTable={handleCloseTable}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TableManagement;
