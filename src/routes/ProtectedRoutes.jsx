import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoutes = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/authorize" replace />;
  }
  return children;
};

const PublicRoutes = ({ isAuth, children }) => {
  if (isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const MerchantRoutes = ({role, children }) => {
  if (role !== "seller") {
    return (
      <>
        <Navigate to="/" replace />
        {toast.error("Unauthorized! You are not a merchant yet.", {
          toastId: "unauthorized",
        })}
      </>
    );
  }
  return children;
};

export { PrivateRoutes, PublicRoutes, MerchantRoutes };
