import React from "react";
import { ColumnsType } from "antd/lib/table";
import { Action, DetailButton, PropertyInfo, Status } from "./Column.component";
import Link from "next/link";
import { Button } from "antd";

export enum AssetStatusType {
  PASSED = "PASSED",
  MINTED = "MINTED",
  TOKENIZED = "TOKENIZED",
  PENDING = "PENDING",
}

export const requestAssetColumns: ColumnsType<any> = [
  {
    title: "Logo",
    dataIndex: "avatar",
    key: "avatar",
    render: (url, dt) => {
      return (
        <PropertyInfo imageUrl={`${dt?.avatar?.host}${dt?.avatar?.url}`} />
      );
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
    render: (text) => <Status status={text} />,
  },
];

export const passedAssetColumns: ColumnsType<any> = [
  {
    title: "Logo",
    dataIndex: "avatar",
    key: "avatar",
    render: (url, dt) => {
      return (
        <PropertyInfo imageUrl={`${dt?.avatar?.host}${dt?.avatar?.url}`} />
      );
    },
  },
  {
    title: "Total Supply",
    dataIndex: "totalSupply",
    key: "totalSupply",
    render: (number) => (number ? number.toLocaleString("en") : "N/A"),
  },
  {
    title: "Token Price",
    dataIndex: "tokenPrice",
    key: "tokenPrice",
    render: (price) => (price ? `$${price}` : "N/A"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Status status={text} />,
  },

  {
    title: "Action",
    dataIndex: "_id",
    key: "_id",
    render: (_, { _id, status }) => {
      if (status === AssetStatusType.PASSED) {
        return (
          <Link
            href={`/portal/${_id}/mint`}
            onClick={(e: Event) => {
              e.stopPropagation();
            }}
          >
            <Button type="default">Mint NFT</Button>
          </Link>
        );
      } else if (status === AssetStatusType.MINTED) {
        return (
          <Link
            href={`/portal/${_id}/frac`}
            onClick={(e: Event) => {
              e.stopPropagation();
            }}
          >
            <Button type="default">Tokenize NFT</Button>
          </Link>
        );
      }
    },
  },
];
