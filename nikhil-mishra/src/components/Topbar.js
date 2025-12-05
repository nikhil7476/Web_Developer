import { useState } from "react";
import { Button } from "react-bootstrap";
import { FiMenu } from "react-icons/fi";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { useSidebar } from "@/components/SidebarContext";

export default function Topbar({ onLogout }) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen toggle
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <header className="adminNavbar">
      <div className="left">
        <FiMenu
          size={26}
          className="menuIcon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h2 className="ms-2">Admin Dashboard</h2>
      </div>

      <div>
        {/* Fullscreen */}
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

        <Button size="md" variant="danger" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
