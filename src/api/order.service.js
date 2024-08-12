import { http } from "@/utils";

const getAllOrders = (merchantCode, page = 1) => {
  return http.get(`/order/${merchantCode}/all?page=${page}`);
};

const getAnOrder = (merchantCode, orderId) => {
  return http.get(`/order/${merchantCode}/get/${orderId}`);
};
const updateAnOrderStatus = (merchantCode, orderId, credentials, token) => {
  return http.patch(`/order/${merchantCode}/update/${orderId}`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  getAllOrders,
  getAnOrder,
  updateAnOrderStatus,
};
