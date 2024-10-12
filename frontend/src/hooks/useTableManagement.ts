import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useTableStore } from "../store/tableStore";
import useOrderStore from "../store/orderStore";
import { useMenuStore } from "../store/menuStore";
import { useStaffStore } from "../store/staffStore";
import { useToast } from "../hooks/useToast";
import * as mutations from "../graphql/mutations";
import { GET_CURRENT_BILL } from "../graphql/queries";
import { MenuItem, OrderItem } from "../types";

export const useTableManagement = () => {
  const { showToast } = useToast();
  const tableStore = useTableStore();
  const orderStore = useOrderStore();
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
    variables: { tableId: tableStore.currentTable },
    skip: !tableStore.currentTable,
  });

  const getCurrentTableObject = useCallback(() => {
    return (
      tableStore.tables.find(
        (table) => table._id === tableStore.currentTable
      ) || null
    );
  }, [tableStore.tables, tableStore.currentTable]);

  useEffect(() => {
    fetchMenuItems();
    tableStore.fetchTables();
  }, [fetchMenuItems, tableStore, tableStore.fetchTables]);

  useEffect(() => {
    if (tableStore.currentTable) {
      refetchBill();
      orderStore.clearOrder(tableStore.currentTable);
      setHasUnsavedChanges(false);
      setCurrentOrderId(null);
      setCurrentBillId(null);
    } else {
      orderStore.clearAllOrders();
    }
  }, [
    tableStore.currentTable,
    refetchBill,
    orderStore.clearOrder,
    orderStore.clearAllOrders,
    orderStore,
  ]);

  useEffect(() => {
    if (billData?.getCurrentBillForTable) {
      const { _id, orders: billOrders } = billData.getCurrentBillForTable;
      setCurrentBillId(_id);
      const currentOrder = billOrders[billOrders.length - 1];
      setCurrentOrderId(currentOrder?._id || null);
    } else {
      setCurrentBillId(null);
      setCurrentOrderId(null);
    }
  }, [billData]);

  const handleCloseTable = useCallback(async () => {
    if (!tableStore.currentTable || !currentStaff) return;
    try {
      const result = await tableStore.unlockTable(tableStore.currentTable);
      if (result.success) {
        showToast(result.message, "success");
        await tableStore.fetchTables();
        tableStore.setCurrentTable(null);
        setCurrentOrderId(null);
        setCurrentBillId(null);
        orderStore.clearOrder(tableStore.currentTable);
      } else {
        showToast(result.message, "error");
      }
    } catch (error: unknown) {
      showToast((error as Error)?.message ?? "Error closing table");
    }
  }, [tableStore, currentStaff, orderStore.clearOrder, showToast]);

  const handleSwitchTable = useCallback(
    async (tableId: string) => {
      if (tableStore.currentTable === tableId || !currentStaff) return;
      try {
        const result = await tableStore.setCurrentTable(tableId);
        showToast(result.message, result.success ? "success" : "error");
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Error switching table",
          "error"
        );
      }
    },
    [tableStore, currentStaff, showToast]
  );

  const handleCreateOrder = useCallback(async () => {
    if (!tableStore.currentTable || !currentStaff) {
      showToast("Cannot create order: no table or staff selected", "error");
      return;
    }

    const currentOrder = orderStore.orders[tableStore.currentTable] || [];
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
            tableId: tableStore.currentTable,
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
        orderStore.clearOrder(tableStore.currentTable);
        await refetchBill();
        await tableStore.fetchTables();
      } else {
        showToast(data.createOrder.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error creating order",
        "error"
      );
    }
  }, [
    tableStore,
    currentStaff,
    orderStore,
    createOrder,
    refetchBill,
    showToast,
  ]);

  const handleUpdateOrder = useCallback(async () => {
    if (!currentOrderId || !tableStore.currentTable) {
      showToast("No current order to update", "error");
      return;
    }

    const currentOrder = orderStore.orders[tableStore.currentTable] || [];
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
        orderStore.clearOrder(tableStore.currentTable);
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
  }, [
    currentOrderId,
    tableStore.currentTable,
    orderStore,
    updateOrder,
    refetchBill,
    showToast,
  ]);

  const handlePayBill = useCallback(async () => {
    if (!currentBillId || !tableStore.currentTable || !currentStaff) {
      showToast("Cannot pay bill: missing information", "error");
      return;
    }

    try {
      const { data } = await settleBill({ variables: { id: currentBillId } });

      if (data.settleBill.success) {
        showToast(data.settleBill.message, "success");
        await tableStore.unlockTable(tableStore.currentTable);
        tableStore.setCurrentTable(null);
        setCurrentBillId(null);
        setCurrentOrderId(null);
        orderStore.clearOrder(tableStore.currentTable);
        await refetchBill();
        await tableStore.fetchTables();
      } else {
        showToast(data.settleBill.message, "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Error settling bill",
        "error"
      );
    }
  }, [
    currentBillId,
    tableStore,
    currentStaff,
    settleBill,
    orderStore,
    refetchBill,
    showToast,
  ]);

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      if (tableStore.currentTable) {
        const orderItem: OrderItem = {
          _id: item._id,
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        };
        orderStore.addOrderItem(tableStore.currentTable, orderItem);
        setHasUnsavedChanges(true);
      }
    },
    [tableStore.currentTable, orderStore.addOrderItem]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      if (tableStore.currentTable) {
        orderStore.removeOrderItem(tableStore.currentTable, itemId);
        setHasUnsavedChanges(true);
      }
    },
    [tableStore.currentTable, orderStore.removeOrderItem]
  );

  const handleRemoveOrderFromBill = useCallback(
    async (orderId: string) => {
      if (!currentBillId || !tableStore.currentTable) {
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
    },
    [
      currentBillId,
      tableStore.currentTable,
      removeOrderFromBill,
      refetchBill,
      showToast,
    ]
  );

  return {
    currentTable: tableStore.currentTable,
    currentOrderId,
    currentBillId,
    hasUnsavedChanges,
    billData,
    billLoading,
    menuItems,
    orders: orderStore.orders,
    tables: tableStore.tables,
    getCurrentTableObject,
    handleCloseTable,
    handleSwitchTable,
    handleCreateOrder,
    handleUpdateOrder,
    handlePayBill,
    handleAddItem,
    handleRemoveItem,
    handleRemoveOrderFromBill,
  };
};
