// Import global styles & necessary libraries
import { useRouter } from "next/router";
import { ToastContainer, Zoom } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/SidebarContext";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Hide normal header/footer on these pages
  const hideLayout = ["/login", "/admin"].includes(router.pathname);

  return (
    <SidebarProvider>
      {!hideLayout && <Header />}
      <Component {...pageProps} />
      {!hideLayout && <Footer />}

      {/* Toast Container for notifications */}
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
