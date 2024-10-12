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
        clearOrder(currentTable);
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

  const handlePayBill = useCallback(async () => {
    if (!currentBillId || !currentTable || !currentStaff) {
      showToast("Cannot pay bill: missing information", "error");
      return;
    }

    try {
      const { data } = await settleBill({ variables: { id: currentBillId } });

      if (data.settleBill.success) {
        showToast(data.settleBill.message, "success");
        await unlockTable(currentTable);
        setCurrentTable(null);
        setCurrentBillId(null);
        setCurrentOrderId(null);
        clearOrder(currentTable);
        await refetchBill();
        await fetchTables();
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
    currentTable,
    currentStaff,
    settleBill,
    unlockTable,
    setCurrentTable,
    showToast,
    clearOrder,
    refetchBill,
    fetchTables,
  ]);

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
    if (!currentBillId || !currentTable) {
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

  return {
    currentTable,
    currentOrderId,
    currentBillId,
    hasUnsavedChanges,
    billData,
    billLoading,
    menuItems,
    orders,
    tables,
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
