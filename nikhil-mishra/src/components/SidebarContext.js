import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverExpand, setHoverExpand] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, setSidebarOpen, hoverExpand, setHoverExpand }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
