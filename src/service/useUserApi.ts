import useAxiosPrivate from "../utils/useAxiosPrivate";

interface UpdateWalletAddresProps {
  message: string;
  wallet_address: string;
}
const useUserApi = () => {
  const axios = useAxiosPrivate();

  const updateWalletAddress = (data: UpdateWalletAddresProps) => {
    return axios.post("/user/update-wallet-address", data);
  };

  return { updateWalletAddress };
};

export default useUserApi;
