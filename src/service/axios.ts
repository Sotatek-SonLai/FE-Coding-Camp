import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
});
