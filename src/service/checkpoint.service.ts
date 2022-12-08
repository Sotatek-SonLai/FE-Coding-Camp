import Request from "../utils/request.util";
import { SERVER_ENDPOINT } from "../constants";
import { FileType } from "../types/asset.type";

export interface IBodyEvaluation {
  dividend_distributor: string;
  evaluation_id: string;
  description: string;
  token_address: string;
  reportFile: any;
}

const CheckpointService = {
  updateCheckpoint: async (body: IBodyEvaluation) => {
    console.log("updateCheckpoint", body);
    try {
      const response = await Request.post(`check-point`, body);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getCheckpointDetail: async (locker: string) => {
    try {
      const response = await Request.get(`check-point/${locker}/escrow`);
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
