export type FileType = {
    name: string
    data: any
};
export interface AssetType {
  id: string;
  propertyInfo: string;
  name: string;
  totalSupply: number;
  tokenPrice: number;
  status?: string;
  action?: string;
  detail: string;
  rewardDate?: string;
}