// Import global styles & necessary libraries
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Zoom } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Render the main component for the page */}
      <Header />
      <Component {...pageProps} />
      <Footer />

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
    </>
  );
}
