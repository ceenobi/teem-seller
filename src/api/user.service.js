import { http } from "@/utils";

const login = (credentials) => {
  return http.post("/auth/login", credentials);
};

const loginViaEmail = (credentials) => {
  return http.post("/auth/email-login", credentials);
};

const verifyLoginEmailLink = (userId, loginCode) => {
  return http.get(`/auth/authorize/${userId}/${loginCode}`);
};

const register = (credentials) => {
  return http.post("/auth/register", credentials);
};

const authUser = (token) => {
  return http.get("/auth", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getRefreshToken = (userId) => {
  return http.get(`/auth/getrefreshtoken/${userId}`);
};

const refreshToken = (refreshToken) => {
  return http.post("/auth/refresh-token", refreshToken);
};

const forgotPassword = (email) => {
  return http.post("/auth/forgot-password", email);
};
const resetPassword = (userId, token, password) => {
  return http.patch(`/auth/reset-password/${userId}/${token}`, password);
};

const updateAccount = (credentials, token) => {
  return http.patch("/auth/update-account", credentials, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteAccount = (token) => {
  return http.delete("/auth/delete-account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  login,
  authUser,
  getRefreshToken,
  refreshToken,
  register,
  forgotPassword,
  resetPassword,
  updateAccount,
  deleteAccount,
  loginViaEmail,
  verifyLoginEmailLink,
};
