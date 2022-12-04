import { Table } from "antd";
import { useRouter } from "next/router";
import React from "react";

const dataSource = [
  {
    _id: "1",
    rank: "1",
    hash: "0xBdkD2hF6dI4Eufd3jS2dsQT",
    quantity: 500000,
    date: "3/12/2022",
  },
  {
    _id: "2",
    rank: "2",
    hash: "0xBdkD2hF6dI4Eufd3jS2dsQT",
    quantity: 500000,
    date: "13/12/2022",
  },
];

const columns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (rank: number) => `#${rank}`,
  },
  {
    title: "Checkpoint Hash",
    dataIndex: "hash",
    key: "hash",
  },
  {
    title: "Quanity",
    dataIndex: "quanity",
    key: "quanity",
    render: (quanity: number) => `${quanity?.toLocaleString("en")} USDT`,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Signature",
    dataIndex: "signature",
    key: "signature",
  },
  {
    title: "Report",
    dataIndex: "report",
    key: "report",
  },
];

const CheckpointTable = () => {
  const router = useRouter();

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 6 }}
      key="rank"
      onRow={(record) => {
        return {
          onClick: (event) => {
            router.push({
              pathname: `/checkpoint`,
              query: { propertyId: router.query.id, checkpointId: record?._id },
            });
          },
        };
      }}
    />
  );
};

export default CheckpointTable;
