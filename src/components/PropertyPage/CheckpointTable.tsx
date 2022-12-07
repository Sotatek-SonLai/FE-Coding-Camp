import { Table } from "antd";
import { useRouter } from "next/router";
import React from "react";
import moment from "moment";
import { DATE_FORMAT } from "../../constants"

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
    dataIndex: "dividend_distributor",
    key: "dividend_distributor",
    render: (quanity: number) => `${quanity?.toLocaleString("en")} USDT`,
  },
  {
    title: "Date",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (value: number) => moment(value).format(DATE_FORMAT),
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

interface IProps {
  data: any
}

const CheckpointTable: React.FC<IProps> = ({data}) => {
  const router = useRouter();

  return (
    <Table
      dataSource={data}
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
