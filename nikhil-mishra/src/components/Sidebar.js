import { FiMail, FiUsers, FiEdit, FiList } from "react-icons/fi";
import { useSidebar } from "@/components/SidebarContext";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { sidebarOpen, hoverExpand, setHoverExpand } = useSidebar();

  const isExpanded = sidebarOpen || hoverExpand;

  return (
    <aside
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => {
        if (!sidebarOpen) setHoverExpand(true);
      }}
      onMouseLeave={() => {
        if (!sidebarOpen) setHoverExpand(false);
      }}
    >
      <ul>
        <li
          className={activeTab === "newsletters" ? "active" : ""}
          onClick={() => setActiveTab("newsletters")}
          title="Newsletters"
        >
          <FiMail size={20} className="icon" />
          {isExpanded && <span>Newsletters</span>}
        </li>

        <li
          className={activeTab === "contacts" ? "active" : ""}
          onClick={() => setActiveTab("contacts")}
          title="Contact List"
        >
          <FiUsers size={20} className="icon" />
          {isExpanded && <span>Contact List</span>}
        </li>

        <li
          className={activeTab === "blogForm" ? "active" : ""}
          onClick={() => setActiveTab("blogForm")}
          title="Add Blog"
        >
          <FiEdit size={20} className="icon" />
          {isExpanded && <span>Add Blog</span>}
        </li>

        <li
          className={activeTab === "blogList" ? "active" : ""}
          onClick={() => setActiveTab("blogList")}
          title="Blog List"
        >
          <FiList size={20} className="icon" />
          {isExpanded && <span>Blog List</span>}
        </li>
      </ul>
    </aside>
  );
}
