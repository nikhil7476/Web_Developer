import Head from "next/head";
import { act, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import NewsletterList from "@/components/NewsletterList";
import ContactList from "@/components/ContactList";
import BlogForm from "@/components/BlogForm";
import BlogList from "@/components/BlogList";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";
import AdminFooter from "@/components/AdminFooter";

/* =====================
   Admin Dashboard Page
====================== */
export default function Admin() {
  /* =====================
     Router
  ====================== */
  const router = useRouter();

  /* =====================
     State
  ====================== */
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("newsletters");

  /* =====================
     Auth Check (Client-Side)
  ====================== */
  useEffect(() => {
    setIsClient(true);

    const adminStatus = sessionStorage.getItem("isAdmin");
    if (!adminStatus) {
      router.push("/login");
    } else {
      setIsAdmin(true);
    }
  }, []);

  /* =====================
     Logout Handler
  ====================== */
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        sessionStorage.removeItem("isAdmin");
        router.replace("/");
      }
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  /* =====================
     Guard Render
  ====================== */
  if (!isClient || !isAdmin) return null;

  return (
    <>
      {/* =====================
          Page Meta
      ====================== */}
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      {/* =====================
          Topbar
      ====================== */}
      <Topbar onLogout={handleLogout} />

      {/* =====================
          Dashboard Layout
      ====================== */}
      <div className="dashboardLayout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mainContent">
          {/* =====================
              Active Content
          ====================== */}
          {activeTab === "newsletters" && <NewsletterList />}
          {activeTab === "contacts" && <ContactList />}
          {activeTab === "blogForm" && <BlogForm />}
          {activeTab === "blogList" && <BlogList />}
          {activeTab === "projectForm" && <ProjectForm />}
          {activeTab === "projectList" && <ProjectList />}

          <AdminFooter />
        </main>
      </div>
    </>
  );
}
