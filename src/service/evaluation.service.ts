import Request from "../utils/request.util";
import {SERVER_ENDPOINT} from "../constants";
import {FileType} from "../types/asset.type";

interface IBodyEvaluation {
    "avatar": FileType,
    "address": string,
    "description": string,
    "certificates": FileType[]
}

const EvaluationService = {
    createLand: async (body: IBodyEvaluation) => {
        try {
            const response = await Request.post(`${SERVER_ENDPOINT}/evaluations`, body);
            return [response.data, null];
        } catch (error) {
            return [null, error];
        }
    },

};

export default EvaluationService;
