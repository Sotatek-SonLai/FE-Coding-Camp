import { Table } from "antd";
import moment from "moment";
import React from "react";
import { DATE_TIME_FORMAT } from "../../constants";

const dataSource = [
  {
    _id: "1",
    type: "Deposit",
    address: "0xBdkD2hF6dI4Eufd3jS2dsQT",
    quantity: 500000,
    date: "3/12/2022",
  },
  {
    _id: "2",
    type: "Withdraw",
    address: "0xBdkD2hF6dI4Eufd3jS2dsQT",
    quantity: 500000,
    date: "13/12/2022",
  },
];

const columns = [
  {
    title: "Transaction Hash",
    dataIndex: "hash",
    key: "hash",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type: string) => type,
  },

  {
    title: "User Addrress",
    dataIndex: "address",
    key: "address",
    render: (address: number) => address,
  },
  {
    title: "Quanity",
    dataIndex: "quanity",
    key: "quanity",
    render: (quanity: number) => `${quanity?.toLocaleString("en")} USDT`,
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: any) => `${moment(date).format(DATE_TIME_FORMAT)}`,
  },
];

const ActivityHistory = () => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 6 }}
      key="rank"
    />
  );
};

export default ActivityHistory;
