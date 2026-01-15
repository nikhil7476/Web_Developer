// Global styles & libraries
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/router";
import { ToastContainer, Zoom } from "react-toastify";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/SidebarContext";

/* =====================
   Custom App Component
====================== */
export default function App({ Component, pageProps }) {
  /* =====================
     Router
  ====================== */
  const router = useRouter();

  /* =====================
     Layout Rules
  ====================== */
  const hideLayout = ["/login", "/admin"].includes(router.pathname);

  return (
    <SidebarProvider>
      {/* =====================
          Header
      ====================== */}
      {!hideLayout && <Header />}

      {/* =====================
          Page Content
      ====================== */}
      <Component {...pageProps} />

      {/* =====================
          Footer
      ====================== */}
      {!hideLayout && <Footer />}

      {/* =====================
          Toast Notifications
      ====================== */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        transition={Zoom}
        theme="dark"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </SidebarProvider>
  );
}
