"use client";

import { useEffect, useCallback, useState } from "react";
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
  // ADD_ORDER_TO_BILL,
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
import { MenuItem, OrderItem } from "../../types";
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
  // const [addOrderToBill] = useMutation(ADD_ORDER_TO_BILL);
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
      price: item.price,
    }));

    console.log("Creating order with:", {
      tableId: currentTable,
      username: currentStaff.username,
      items: orderItems,
    });

    if (billData?.getCurrentBillForTable) {
      await handleAddOrderToBill(data.createOrder.order._id);
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

  useEffect(() => {}, [currentStaff]);

  const handleUpdateOrder = async () => {
    if (!currentOrderId || !currentTable) return;

    const currentOrder = orders[currentTable] || [];
    const orderItems = currentOrder.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    console.log(orderItems);
    refetchBill();

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
      // TODO: implement toastbox for error handlin
    }
  };

  const handleCreateBill = async () => {
    if (!currentTable || !currentStaff) return;

    try {
      const { data } = await createBill({
        variables: {
          createBillInput: {
            tableId: currentTable,
            username: currentStaff.username,
          },
        },
      });

      if (data.createBill) {
        setCurrentBillId(data.createBill._id);

        // Update the table with the new bill ID
        await updateTable({
          variables: {
            _id: currentTable,
            isOccupied: true,
            currentBillId: data.createBill._id,
          },
        });

        refetchBill();
        await fetchTables();
      }
    } catch (error) {
      console.error("Error creating bill:", error);
      // TODO: implement toastbox for error handling
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
      // TODO: implement toastbox for error handling
    }
  };

  const handleAddOrderToBill = async (orderId: string) => {
    if (!billData?.getCurrentBillForTable) return;

    try {
      await addOrderToBill({
        variables: { billId: billData.getCurrentBillForTable._id, orderId },
      });
      refetchBill();
    } catch (error) {
      console.error("Error adding order to bill:", error);
      // TODO: implement toastbox for error handling
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
      <div className="w-2/3 p-4 bg-gray-800 overflow-y-auto">
        <MenuItems menuItems={menuItems} onAddItem={handleAddItem} />
      </div>
      <div className="w-1/3 p-4 border-l border-gray-600 bg-gray-800 flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <LockedTables
            lockedTables={lockedTables}
            currentTable={currentTable}
            onSwitchTable={handleSwitchTable}
          />
          {currentTable && (
            <>
              {billLoading ? (
                <p>Loading bill...</p>
              ) : billData?.getCurrentBillForTable ? (
                <BillSummary
                  bill={billData.getCurrentBillForTable}
                  onRemoveOrder={handleRemoveOrderFromBill}
                />
              ) : (
                <p>No active bill for this table.</p>
              )}
              <OrderList
                order={currentOrder}
                onRemoveItem={handleRemoveItem}
                total={total}
              />
            </>
          )}
        </div>
        {currentTable && (
          <div className="mt-4">
            <TableActions
              currentOrderId={currentOrderId}
              currentBillId={currentBillId}
              onCreateOrder={handleCreateOrder}
              onUpdateOrder={handleUpdateOrder}
              onCreateBill={handleCreateBill}
              onPayBill={handlePayBill}
              onCloseTable={handleCloseTable}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableManagement;
