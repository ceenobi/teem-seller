import { http } from "@/utils";

const createCategory = (merchantCode, credentials, token) => {
  return http.post(`/category/${merchantCode}/create`, credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllCategories = (merchantCode) => {
  return http.get(`/category/${merchantCode}/all`);
};

const getACategory = (merchantCode, categoryId) => {
  return http.get(`/category/${merchantCode}/get/${categoryId}`);
};

const updateACategory = (merchantCode, categoryId, credentials, token) => {
  return http.patch(
    `/category/${merchantCode}/update/${categoryId}`,
    credentials,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteCategory = (merchantCode, categoryId, token) => {
  return http.delete(`/category/${merchantCode}/delete/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  createCategory,
  getAllCategories,
  getACategory,
  updateACategory,
  deleteCategory,
};
