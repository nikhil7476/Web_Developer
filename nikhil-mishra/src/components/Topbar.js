import { useState } from "react";
import { Button } from "react-bootstrap";
import { FiMenu } from "react-icons/fi";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";

import { useSidebar } from "@/components/SidebarContext";

/* =====================
   Admin Topbar Component
====================== */
export default function Topbar({ onLogout }) {
  /* =====================
     Sidebar Context
  ====================== */
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  /* =====================
     State
  ====================== */
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* =====================
     Fullscreen Toggle
  ====================== */
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  /* =====================
     Render
  ====================== */
  return (
    <header className="adminNavbar fixed-top">
      {/* =====================
          Left Section
      ====================== */}
      <div className="left">
        <FiMenu
          size={26}
          className="menuIcon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h1 className="ms-2 fs-4 mb-0">Admin Dashboard</h1>
      </div>

      {/* =====================
          Right Section
      ====================== */}
      <div>
        {/* Fullscreen Toggle */}
        <Button
          variant="light"
          onClick={handleFullscreenToggle}
          className="me-2"
        >
          {isFullscreen ? (
            <BsFullscreenExit size={18} />
          ) : (
            <BsArrowsFullscreen size={18} />
          )}
        </Button>

        {/* Logout */}
        <Button size="md" variant="danger" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
