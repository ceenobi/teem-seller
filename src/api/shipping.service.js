import { http } from "@/utils";

const createShipping = (merchantCode, credentials, token) => {
  return http.post(`/shipping/${merchantCode}/create`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllShipping = (merchantCode) => {
  return http.get(`/shipping/${merchantCode}/all`);
};

const getShipping = (merchantCode, shippingId) => {
  return http.get(`/shipping/${merchantCode}/get/${shippingId}`);
};

const updateShipping = (merchantCode, shippingId, credentials, token) => {
  return http.patch(
    `/shipping/${merchantCode}/update/${shippingId}`,
    credentials,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteShipping = (merchantCode, shippingId, token) => {
  return http.delete(`/shipping/${merchantCode}/delete/${shippingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  createShipping,
  getAllShipping,
  getShipping,
  updateShipping,
  deleteShipping,
};
