import { useStore } from "@/hooks";
import { useEffect } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginByMail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyLogin = useLoaderData();
  const { setToken } = useStore();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (verifyLogin) {
      toast.success(verifyLogin.data.msg, { toastId: "Welcome login user" });
      setToken(verifyLogin.data.accessToken);
      navigate(from);
    }
  }, [from, navigate, setToken, verifyLogin]);

  return;
};

export default LoginByMail;
