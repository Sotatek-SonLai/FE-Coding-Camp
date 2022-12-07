import Request from "../utils/request.util";
import { SERVER_ENDPOINT } from "../constants";
import { FileType } from "../types/asset.type";

export interface IBodyEvaluation {
  dividend_distributor: string;
  evaluation_id: string;
  description: string;
  token_address: string;
}

const CheckpointService = {
  updateCheckpoint: async (body: IBodyEvaluation) => {
    try {
      const response = await Request.post(`check-point`, body);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getCheckpointDetail: async (evaluation_id: string) => {
    try {
      const response = await Request.get(`check-point`, { evaluation_id });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  sendSerializedTransaction: async (
    evaluation_id: any,
    base64_serialized_tx: any
  ) => {
    try {
      const response = await Request.post(`check-point/get-signature`, {
        evaluation_id,
        base64_serialized_tx,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default CheckpointService;
