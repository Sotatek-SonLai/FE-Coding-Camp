import { message, message as msg } from "antd";
import { AxiosResponse } from "axios";

const UnauthorizedCallback = (mess: string) => {
  message.error(mess);
};

let timeoutFlag: NodeJS.Timeout;

const handleErrorUtil = (response: AxiosResponse<any>) => {
  const { status, data } = response;
  switch (status) {
    case 401:
      // clearTimeout(timeoutFlag);
      // timeoutFlag = setTimeout(() => {
      // UnauthorizedCallback(data?.message)
      // }, 1500);
      return {
        ...response,
        data: {
          ...response.data,
          message: null,
        },
      };
    default:
      return response;
  }

  return response;
};

export default handleErrorUtil;
