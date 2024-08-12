import { http } from "@/utils";

const createTax = (merchantCode, credentials, token) => {
  return http.post(`/tax/${merchantCode}/create`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllTax = (merchantCode) => {
  return http.get(`/tax/${merchantCode}/all`);
};

const getASingleTax = (merchantCode, taxId) => {
  return http.get(`/tax/${merchantCode}/get/${taxId}`);
};

const updateTax = (merchantCode, taxId, credentials, token) => {
  return http.patch(`/tax/${merchantCode}/update/${taxId}`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteTax = (merchantCode, taxId, token) => {
  return http.delete(`/tax/${merchantCode}/delete/${taxId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default { createTax, getAllTax, getASingleTax, updateTax, deleteTax };
