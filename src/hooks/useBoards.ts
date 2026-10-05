import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Board } from '../types/media';

const BOARDS_STORAGE_KEY = 'pictaip_boards_v1';

export const DEFAULT_BOARD_ID = 'default-saved';

const INITIAL_DEFAULT_BOARD: Board = {
  id: DEFAULT_BOARD_ID,
  name: 'Pin Tersimpan',
  description: 'Koleksi visual & prompt AI favorit Anda',
  itemIds: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>(() => {
    if (typeof window === 'undefined') return [INITIAL_DEFAULT_BOARD];
    try {
      const stored = localStorage.getItem(BOARDS_STORAGE_KEY);
      if (stored) {
        const parsed: Board[] = JSON.parse(stored);
        // Ensure default board always exists
        if (!parsed.some((b) => b.id === DEFAULT_BOARD_ID)) {
          return [INITIAL_DEFAULT_BOARD, ...parsed];
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse boards from localStorage:', e);
    }
    return [INITIAL_DEFAULT_BOARD];
  });

  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
    } catch (e) {
      console.error('Failed to save boards to localStorage:', e);
    }
  }, [boards]);

  // Create a new custom board
  const createBoard = useCallback((name: string, description?: string): Board => {
    const trimmedName = name.trim();
    if (!trimmedName) throw new Error('Nama board tidak boleh kosong');

    const newBoard: Board = {
      id: `board-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      description: description?.trim() || '',
      itemIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBoards((prev) => [...prev, newBoard]);
    return newBoard;
  }, []);

  // Delete a custom board (default board cannot be deleted)
  const deleteBoard = useCallback((boardId: string) => {
    if (boardId === DEFAULT_BOARD_ID) return;
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setActiveBoardId((prev) => (prev === boardId ? null : prev));
  }, []);

  // Toggle a pin in a specific board
  const togglePinInBoard = useCallback((boardId: string, itemId: string): boolean => {
    let wasAdded = false;

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== boardId) return board;

        const exists = board.itemIds.includes(itemId);
        wasAdded = !exists;
        const newItemIds = exists
          ? board.itemIds.filter((id) => id !== itemId)
          : [itemId, ...board.itemIds];

        return {
          ...board,
          itemIds: newItemIds,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    return wasAdded;
  }, []);

  // Quick save toggle (toggles in default board)
  const toggleQuickSave = useCallback(
    (itemId: string): boolean => {
      return togglePinInBoard(DEFAULT_BOARD_ID, itemId);
    },
    [togglePinInBoard]
  );

  // Check if item is saved in any board
  const isItemSavedAnywhere = useCallback(
    (itemId: string): boolean => {
      return boards.some((board) => board.itemIds.includes(itemId));
    },
    [boards]
  );

  // Get list of all unique saved pin IDs across all boards
  const allSavedPinIds = useMemo(() => {
    const ids = new Set<string>();
    boards.forEach((board) => {
      board.itemIds.forEach((id) => ids.add(id));
    });
    return Array.from(ids);
  }, [boards]);

  // Active board object
  const activeBoard = useMemo(() => {
    if (!activeBoardId) return null;
    return boards.find((b) => b.id === activeBoardId) || null;
  }, [boards, activeBoardId]);

  return {
    boards,
    activeBoardId,
    setActiveBoardId,
    activeBoard,
    createBoard,
    deleteBoard,
    togglePinInBoard,
    toggleQuickSave,
    isItemSavedAnywhere,
    allSavedPinIds,
  };
}
