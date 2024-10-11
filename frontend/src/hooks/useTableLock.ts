import { useMutation } from '@apollo/client';
import { LOCK_TABLE, UNLOCK_TABLE } from '../graphql/mutations';
import { useState } from 'react';

export const useTableLock = () => {
  const [lockTableMutation] = useMutation(LOCK_TABLE);
  const [unlockTableMutation] = useMutation(UNLOCK_TABLE);
  const [isLocking, setIsLocking] = useState(false);


  const lockTable = async (tableId: string, username: string) => {
    // Prevent multiple simultaneous lock attempts
    if (isLocking) return;
    setIsLocking(true);
    try {
      const result = await lockTableMutation({
        variables: { tableId, username },
      });
      if (result.data.lockTable.success) {
        console.log(result.data.lockTable.message);
      } else {
        console.error(result.data.lockTable.message);
      }
    } catch (error) {
      console.error("Error locking table:", error);
    } finally {
      setIsLocking(false);
    }
  };

  const unlockTable = async (tableId: string, username: string) => {
    try {
      const result = await unlockTableMutation({
        variables: { tableId, username },
      });
      if (result.data.unlockTable.success) {
        console.log(result.data.unlockTable.message);
      } else {
        console.error(result.data.unlockTable.message);
      }
    } catch (error) {
      console.error("Error unlocking table:", error);
    }
  };

  return { lockTable, unlockTable };
};