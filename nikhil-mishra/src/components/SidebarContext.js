import { createContext, useContext, useState } from "react";

/* =====================
   Sidebar Context
====================== */
const SidebarContext = createContext();

/* =====================
   Sidebar Provider
====================== */
export function SidebarProvider({ children }) {
  /* =====================
     State
  ====================== */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);

  /* =====================
     Context Value
  ====================== */
  const value = {
    sidebarOpen,
    setSidebarOpen,
    hoverExpand,
    setHoverExpand,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

/* =====================
   Sidebar Hook
====================== */
export function useSidebar() {
  return useContext(SidebarContext);
}
