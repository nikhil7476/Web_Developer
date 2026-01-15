import { FaCodepen } from "react-icons/fa";
import { FiMail, FiUsers, FiEdit, FiList } from "react-icons/fi";
import { useSidebar } from "@/components/SidebarContext";

/* =====================
   Sidebar Component
====================== */
export default function Sidebar({ activeTab, setActiveTab }) {
  /* =====================
     Sidebar Context
  ====================== */
  const { sidebarOpen, hoverExpand, setHoverExpand } = useSidebar();

  const isExpanded = sidebarOpen || hoverExpand;

  /* =====================
     Hover Handlers
  ====================== */
  const handleMouseEnter = () => {
    if (!sidebarOpen) setHoverExpand(true);
  };

  const handleMouseLeave = () => {
    if (!sidebarOpen) setHoverExpand(false);
  };

  /* =====================
     Render
  ====================== */
  return (
    <aside
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul>
        {/* =====================
            Newsletters
        ====================== */}
        <li
          className={activeTab === "newsletters" ? "active" : ""}
          onClick={() => setActiveTab("newsletters")}
          title="Newsletters"
        >
          <FiMail size={20} className="icon" />
          {isExpanded && <span>Newsletters</span>}
        </li>

        {/* =====================
            Contacts
        ====================== */}
        <li
          className={activeTab === "contacts" ? "active" : ""}
          onClick={() => setActiveTab("contacts")}
          title="Contact List"
        >
          <FiUsers size={20} className="icon" />
          {isExpanded && <span>Contact List</span>}
        </li>

        {/* =====================
            Add Blog
        ====================== */}
        <li
          className={activeTab === "blogForm" ? "active" : ""}
          onClick={() => setActiveTab("blogForm")}
          title="Add Blog"
        >
          <FiEdit size={20} className="icon" />
          {isExpanded && <span>Add Blog</span>}
        </li>

        {/* =====================
            Blog List
        ====================== */}
        <li
          className={activeTab === "blogList" ? "active" : ""}
          onClick={() => setActiveTab("blogList")}
          title="Blog List"
        >
          <FiList size={20} className="icon" />
          {isExpanded && <span>Blog List</span>}
        </li>

        {/* =====================
            Add Projects
        ====================== */}
        <li
          className={activeTab === "projectForm" ? "active" : ""}
          onClick={() => setActiveTab("projectForm")}
          title="Add Project"
        >
          <FaCodepen size={20} className="icon" />
          {isExpanded && <span>Add Project</span>}
        </li>

        {/* =====================
            Project List
        ====================== */}
        <li
          className={activeTab === "projectList" ? "active" : ""}
          onClick={() => setActiveTab("projectList")}
          title="Project List"
        >
          <FiList size={20} className="icon" />
          {isExpanded && <span>Project List</span>}
        </li>
      </ul>
    </aside>
  );
}
