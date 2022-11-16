import { Table, Tabs } from "antd";
import React from "react";
import {
  passedAssetColumns,
  PassedAssetDataType,
  requestAssetColumns,
  RequestAssetDataType,
} from "../components/PortalEvaluationPage/AssestTable";

const requestAssetData: RequestAssetDataType[] = [
  {
    id: "1",
    propertyInfo: "https://joeschmoe.io/api/v1/random",
    name: "ABC",
    totalSupply: 100000,
    tokenPrice: 0.0001,
    status: "pending",
    action: "Fractionalize",
    detail: "Detail",
  },
  {
    id: "2",
    propertyInfo: "https://joeschmoe.io/api/v1/random",
    name: "Trinh Thi Thu Trang Trinh Thi Thu Trang Trinh Thi Thu Trang",
    totalSupply: 1000000000,
    tokenPrice: 0.001,
    status: "rejected",
    action: "Fractionalize",
    detail: "Detail",
  },
];

const passedAssetData: PassedAssetDataType[] = [
  {
    id: "1",
    propertyInfo: "https://joeschmoe.io/api/v1/random",
    name: "ABC",
    totalSupply: 100000,
    tokenPrice: 0.0001,
    status: "fractionalize",
    payRewardDate: "",
    action: "Listing",
    detail: "Detail",
  },
  {
    id: "2",
    propertyInfo: "https://joeschmoe.io/api/v1/random",
    name: "Trinh Thi Thu Trang Trinh Thi Thu Trang Trinh Thi Thu Trang",
    totalSupply: 1000000000,
    tokenPrice: 0.001,
    status: "listed",
    payRewardDate: "11/11/2022",
    action: "Deposit",
    detail: "Detail",
  },
];

const portal_evaluation = () => {
  const items = [
    {
      label: "Request Asset",
      key: "request_asset",
      children: (
        <Table
          dataSource={requestAssetData}
          columns={requestAssetColumns}
          rowKey="id"
        />
      ),
    },
    {
      label: "Passed Asset",
      key: "passed_asset",
      children: (
        <Table
          dataSource={passedAssetData}
          columns={passedAssetColumns}
          rowKey="id"
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs items={items} />
    </div>
  );
};

export default portal_evaluation;
