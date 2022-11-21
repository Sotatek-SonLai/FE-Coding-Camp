import axios from "../axios";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export const login = (credentials: AuthCredentials) => {
  return axios.post("/api/v1/auth/login", credentials);
};

export const signUp = (data: SignUpData) => {
  return axios.post("/api/v1/auth/register", data);
};

export const getAccessToken = () => {
  return axios.get("/refresh", {
    withCredentials: true,
  });
};
