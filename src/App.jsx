import { AppRoutes } from "@/routes";
import { StoreProvider } from "@/store";
import { ToastContainer, Zoom } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <StoreProvider>
        <ToastContainer position="top-right" transition={Zoom} />
        <AppRoutes />
      </StoreProvider>
    </HelmetProvider>
  );
}

export default App;
