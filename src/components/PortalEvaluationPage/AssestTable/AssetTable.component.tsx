import React from "react";
import { ColumnsType } from "antd/lib/table";
import { Action, DetailButton, PropertyInfo, Status } from "./Column.component";

export interface RequestAssetDataType {
  id: string;
  propertyInfo: string;
  name: string;
  totalSupply: number;
  tokenPrice: number;
  status: string;
  action: string;
  detail: string;
}

export const requestAssetColumns: ColumnsType<RequestAssetDataType> = [
  {
    title: "Property Info",
    dataIndex: "propertyInfo",
    key: "propertyInfo",
    render: (url) => {
      return <PropertyInfo imageUrl={url} />;
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Total Supply",
    dataIndex: "totalSupply",
    key: "totalSupply",
    render: (number) => number.toLocaleString("en"),
  },
  {
    title: "Token Price",
    dataIndex: "tokenPrice",
    key: "tokenPrice",
    render: (price) => `$${price}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Status status={text} />,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, { id, action }) => <Action action={action} assetId={id} />,
  },
  {
    title: "Detail",
    dataIndex: "detail",
    key: "detail",
    render: (_, { id }) => <DetailButton assetId={id} />,
  },
];

export interface PassedAssetDataType {
  id: string;
  propertyInfo: string;
  name: string;
  totalSupply: number;
  tokenPrice: number;
  status: string;
  payRewardDate: string;
  action: string;
  detail: string;
}

export const passedAssetColumns: ColumnsType<PassedAssetDataType> = [
  {
    title: "Property Info",
    dataIndex: "propertyInfo",
    key: "propertyInfo",
    render: (url) => {
      return <PropertyInfo imageUrl={url} />;
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Total Supply",
    dataIndex: "totalSupply",
    key: "totalSupply",
    render: (number) => number.toLocaleString("en"),
  },
  {
    title: "Token Price",
    dataIndex: "tokenPrice",
    key: "tokenPrice",
    render: (price) => `$${price}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Status status={text} />,
  },
  {
    title: "Pay reward date",
    dataIndex: "payRewardDate",
    key: "payRewardDate",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, { id, action }) => <Action action={action} assetId={id} />,
  },
  {
    title: "Detail",
    dataIndex: "detail",
    key: "detail",
    render: (_, { id }) => <DetailButton assetId={id} />,
  },
];
