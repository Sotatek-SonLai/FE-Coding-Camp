import Request from "../utils/request.util";
import Cookies from "js-cookie";
import { SERVER_ENDPOINT } from "../constants";
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

const UserService = {
  getMe: async () => {
    try {
      if (!Cookies.get("accessToken")) {
        throw new Error("");
      } else {
        const response = await Request.get(`${SERVER_ENDPOINT}/user`);
        return [response.data, null];
      }
    } catch (error) {
      return [null, error];
    }
  },

  login: async (credentials: AuthCredentials) => {
    try {
      const response = await Request.post("/login", credentials);
      Cookies.set("accessToken", response.data.accessToken);
      return response;
    } catch (error) {
      return [null, error];
    }
  },

  signUp: async (data: SignUpData) => {
    try {
      const response = Request.post("/signup", data);
    } catch (error) {
      return [null, error];
    }
  },
};

export default UserService;
