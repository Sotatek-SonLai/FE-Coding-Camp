import Request from "../utils/request.util";
import Cookies from "js-cookie";
import {SERVER_ENDPOINT} from "../constants";


const UserService = {
	getMe: async () => {
		try {
			if(!Cookies.get("accessToken")){
				throw new Error('');
			} else {
				const response = await Request.get(
					`${SERVER_ENDPOINT}/user`);
				return [response.data, null];
			}
		} catch (error) {
			return [null, error];
		}
	},

};

export default UserService;
