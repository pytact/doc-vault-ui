/**
 * Modal State Management Hook
 * Based on R5 rules
 */

import { useState, useCallback } from "react";

interface UseModalStateReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Modal open/close state management hook
 * Handles modal visibility state
 */
export function useModalState(initialState = false): UseModalStateReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

