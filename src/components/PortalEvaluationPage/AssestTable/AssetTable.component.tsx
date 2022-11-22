import React from "react";
import { ColumnsType } from "antd/lib/table";
import { Action, DetailButton, PropertyInfo, Status } from "./Column.component";
import Link from "next/link";

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

export const requestAssetColumns: ColumnsType<any> = [
  {
    title: "Logo",
    dataIndex: "avatar",
    key: "avatar",
    render: (url, dt) => {
      return <PropertyInfo imageUrl={`${dt?.avatar?.host}${dt?.avatar?.url}`} />;
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    ellipsis: true,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Status status={'pending'} />,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, { id, action }) => <Action action={action} assetId={id} />,
  },
  {
    title: "Detail",
    dataIndex: "_id",
    key: "_id",
    render: (_, { _id }) => <Link href={`/portal/${_id}/mint-nft`}>detail</Link>,
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
