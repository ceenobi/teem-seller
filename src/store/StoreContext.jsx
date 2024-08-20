import { merchantService, userService } from "@/api";
import { usePersist } from "@/hooks";
import { createContext, useEffect, useCallback, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const ContextStore = createContext({});

export const StoreProvider = ({ children }) => {
  const [token, setToken] = usePersist("sellerAccessToken", null);
  const [getUsername, setGetUsername] = usePersist("getUsername", null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [taxData, setTaxData] = useState([]);
  const [shippingData, setShippingData] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [getProducts, setGetProducts] = useState([]);
  const [getDiscounts, setGetDiscounts] = useState([]);
  const [getCustomers, setGetCustomers] = useState([]);
  const [getOrders, setGetOrders] = useState([]);
  const [getOrderDetail, setGetOrderDetail] = useState(null);
  const [page, setPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);

  //check token valid
  function isTokenValid(checkToken) {
    if (typeof checkToken !== "string") {
      console.error("Invalid token specified: must be a string");
      return false;
    }
    try {
      const decoded = jwtDecode(checkToken);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  const logout = useCallback(() => {
    toast.info("You are logged out", { toastId: "logout" });
    setLoggedInUser(null);
    setToken(null);
    setMerchant(null);
  }, [setLoggedInUser, setMerchant, setToken]);

  //get user details
  const getUser = useCallback(async () => {
    if (!isTokenValid(token)) return;
    try {
      const { data } = await userService.authUser(token);
      setLoggedInUser(data);
      setGetUsername(data.username);
    } catch (error) {
      console.error(error);
    }
  }, [setLoggedInUser, setGetUsername, token]);

  const getMerchant = useCallback(async () => {
    if (!isTokenValid(token)) return;
    try {
      const { data } = await merchantService.getMerchant(token);
      setMerchant(data);
    } catch (error) {
      console.error(error);
    }
  }, [setMerchant, token]);

  //referesh user token
  const refreshUserToken = useCallback(async () => {
    if (!getUsername) return;
    if (!isTokenValid(token)) {
      setToken(null);
    }
    try {
      const {
        data: { refreshToken },
      } = await userService.getRefreshToken(getUsername);
      const {
        data: { accessToken },
      } = await userService.refreshToken({ refreshToken });
      setToken(accessToken);
      getUser();
    } catch (error) {
      console.error(error);
      // setToken(null);
    }
  }, [getUsername, setToken, getUser, token]);

  useEffect(() => {
    getUser();
    getMerchant();
  }, [getMerchant, getUser]);

  useEffect(() => {
    if (!token) return;

    const refresh = async () => {
      const tokenExp = new Date(jwtDecode(token).exp * 1000);
      if (tokenExp - new Date() < 60 * 1000) {
        try {
          await refreshUserToken();
        } catch (error) {
          console.error(error);
          // setToken(null);
        }
      }
    };

    const interval = setInterval(
      () => {
        refreshUserToken();
        refresh();
      },
      12 * 60 * 1000
    );

    refresh();
    return () => clearInterval(interval);
  }, [refreshUserToken, setToken, token]);

  const itemsPerPage = 10;

  const contextData = {
    itemsPerPage,
    token,
    setToken,
    loggedInUser,
    logout,
    setLoggedInUser,
    merchant,
    setMerchant,
    getUser,
    getMerchant,
    taxData,
    setTaxData,
    shippingData,
    setShippingData,
    getCategories,
    setGetCategories,
    getProducts,
    setGetProducts,
    page,
    setPage,
    getDiscounts,
    setGetDiscounts,
    customerPage,
    setCustomerPage,
    getCustomers,
    setGetCustomers,
    getOrders,
    setGetOrders,
    orderPage,
    setOrderPage,
    getOrderDetail,
    setGetOrderDetail,
  };

  return (
    <ContextStore.Provider value={contextData}>
      {children}
    </ContextStore.Provider>
  );
};
