import Request from "../utils/request.util";
import Cookies from "js-cookie";
import {SERVER_ENDPOINT} from "../constants";


const UserService = {
	login: async () => {
		try {
			const response = await Request.post(``);
			return [response.data, null];
		} catch (error) {
			return [null, error];
		}
	},

};

export default UserService;
