import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NewsletterList from "@/components/NewsletterList";
import ContactList from "@/components/ContactList";
import BlogForm from "@/components/BlogForm";
import BlogList from "@/components/BlogList";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AdminFooter from "@/components/AdminFooter";

export default function Admin() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState("newsletters");

  useEffect(() => {
    setIsClient(true);
    const adminStatus = sessionStorage.getItem("isAdmin");
    if (!adminStatus) router.push("/login");
    else setIsAdmin(true);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        sessionStorage.removeItem("isAdmin");
        router.replace("/");
      }
    } catch (e) {
      console.log("Logout failed:", e);
    }
  };

  if (!isClient || !isAdmin) return null;

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      <Topbar onLogout={handleLogout} />

      <div className="dashboardLayout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mainContent">
          {activeTab === "newsletters" && <NewsletterList />}
          {activeTab === "contacts" && <ContactList />}
          {activeTab === "blogForm" && <BlogForm />}
          {activeTab === "blogList" && <BlogList />}
          <AdminFooter />
        </main>
      </div>
    </>
  );
}
