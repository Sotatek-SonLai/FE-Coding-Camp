import { Table } from "antd";
import { useRouter } from "next/router";
import React from "react";
import moment from "moment";
import { DATE_FORMAT } from "../../constants";
import { getUrl } from "../../utils/utility";

const columns = [
  {
    title: "Id",
    dataIndex: "checkpointId",
    key: "checkpointId",
    width: "5%",
    render: (checkpointId: number) => (checkpointId ? `#${checkpointId}` : ""),
  },
  {
    title: "Checkpoint Hash",
    dataIndex: "checkpoint_hash",
    ellipsis: true,
    key: "checkpoint_hash",
  },
  {
    title: "Quanity",
    dataIndex: "totalDistributionAmount",
    key: "totalDistributionAmount",
    render: (quanity: number, _: any) => {
      return `${quanity / 10 ** _.decimals}`;
    },
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value: number) => moment(value).format(DATE_FORMAT),
  },
  {
    title: "Token Address",
    dataIndex: "token_address",
    ellipsis: true,
    key: "token_address",
  },
  {
    title: "Report",
    dataIndex: "report",
    key: "report",
    render: (file: any) => {
      return (
        <>
          <a
            href={getUrl(file)}
            rel="noreferrer"
            target="_blank"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {file?.name}
          </a>
        </>
      );
    },
  },
];

interface IProps {
  data: any;
}

const CheckpointTable: React.FC<IProps> = ({ data }) => {
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
