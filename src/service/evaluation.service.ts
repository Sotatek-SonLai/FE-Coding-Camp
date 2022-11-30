import Request from "../utils/request.util";
import {SERVER_ENDPOINT} from "../constants";
import {FileType} from "../types/asset.type";

export interface IBodyEvaluation {
    "avatar": FileType,
    "address": string,
    "description": string,
    "certificates": FileType[]
    "projectImages": FileType[]
    "attributes": any
}

const EvaluationService = {
    createLand: async (body: IBodyEvaluation) => {
        try {
            const response = await Request.post(`evaluations`, body);
            return [response.data, null];
        } catch (error) {
            return [null, error];
        }
    },
    getLand: async () => {
        try {
            const response = await Request.get(`evaluations`);
            return [response.data, null];
        } catch (error) {
            return [null, error];
        }
    },
    getDetail: async (id: any) => {
        try {
            const response = await Request.get(`evaluations/${id}`);
            return [response.data, null];
        } catch (error) {
            return [null, error];
        }
    },
    mintNft: async (base64_serialized_tx: any, id: any) => {
        try {
            const response = await Request.post(`mint`, {
                base64_serialized_tx,
                id
            });
            return [response.data, null];
        } catch (error) {
            return [null, error];
        }
    },
    frac: async (id: any, body: any) => {
        try {
            const response = await Request.put(`evaluations/${id}/tokenize`, body);
            return [response.data, null];
        } catch (error) {
            return [null, error];
        }
    },
    updateAssetMetadata: async (id: any, body: any) => {
        try {
            const response = await Request.put(`evaluations/${id}/assetMetadata`,body);
            return [response.data, null];
        } catch (error) {
            return [null, error];
        }
    }

};

export default EvaluationService;
