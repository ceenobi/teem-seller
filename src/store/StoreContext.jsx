import { merchantService, userService } from "@/api";
import { usePersist } from "@/hooks";
import { createContext, useEffect, useCallback, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const ContextStore = createContext({});

export const StoreProvider = ({ children }) => {
  const [token, setToken] = usePersist("sellerAccessToken", null);
  const [loggedInUser, setLoggedInUser] = usePersist("sellerDetails", null);
  const [merchant, setMerchant] = usePersist("merchant", null);
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
    } catch (error) {
      console.error(error);
    }
  }, [setLoggedInUser, token]);

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
    try {
      const refreshTokenResponse = await userService.getRefreshToken(
        loggedInUser?._id
      );
      const accessTokenResponse = await userService.refreshToken({
        refreshToken: refreshTokenResponse.data.refreshToken,
      });
      setToken(accessTokenResponse.data.accessToken);
      getUser();
    } catch (error) {
      console.error(error);
      setToken(null);
      setMerchant(null);
    }
  }, [loggedInUser?._id, setToken, getUser, setMerchant]);

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
          setToken(null);
        }
      }
    };

    const interval = setInterval(
      () => {
        refreshUserToken();
        refresh();
      },
      6 * 60 * 1000
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
