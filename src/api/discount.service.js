import { http } from "@/utils";

const createDiscount = (merchantCode, credentials, token) => {
  return http.post(`/discount/${merchantCode}/create`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateDiscount = (merchantCode, discountId, credentials, token) => {
  return http.patch(
    `/discount/${merchantCode}/update/${discountId}`,
    credentials,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteDiscount = (merchantCode, discountId, token) => {
  return http.delete(`/discount/${merchantCode}/delete/${discountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getADiscount = (merchantCode, discountId) => {
  return http.get(`/discount/${merchantCode}/get/${discountId}`);
};

const getAllDiscounts = (merchantCode) => {
  return http.get(`/discount/${merchantCode}/all`);
};

export default {
  createDiscount,
  getADiscount,
  updateDiscount,
  getAllDiscounts,
  deleteDiscount,
};
