import { http } from "@/utils";

const getAllCustomers = (merchantCode, page = 1) => {
  return http.get(`/customer/${merchantCode}/all?page=${page}`);
};

const getACustomer = (merchantCode, username) => {
  return http.get(`/customer/${merchantCode}/get/${username}`);
};

const deleteACustomer = (merchantCode, username, token) => {
  return http.delete(`/customer/${merchantCode}/delete/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  getAllCustomers,
  getACustomer,
  deleteACustomer,
};
