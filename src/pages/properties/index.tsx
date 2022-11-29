import { Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { ReactElement } from "react";
import { AssetType } from "../../types";
import PropertyInfo from "../../components/common/PropertyInfo";
import { useRouter } from "next/router";
const { Title } = Typography;
import { URL_PROPERTIES } from "../../constants";
import MainLayout from "../../components/Main-Layout";
import { useState } from "react";
import { useEffect } from "react";
import EvaluationService from "../../service/evaluation.service";

export const requestAssetColumns: ColumnsType<AssetType> = [
  {
    title: "Property Info",
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
  // {
  //   title: "Total Supply",
  //   dataIndex: "totalSupply",
  //   key: "totalSupply",
  //   render: (number) => number.toLocaleString("en"),
  // },
  // {
  //   title: "Token Price",
  //   dataIndex: "tokenPrice",
  //   key: "tokenPrice",
  //   render: (price) => `$${price}`,
  // },
  {
    title: "Reward Date",
    dataIndex: "rewardDate",
    key: "rewardDate",
  },
];

const PorpertiesPage = () => {
  const [requestAssetData, setRequestAssetData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const [res]: any = await EvaluationService.getLand();
      setRequestAssetData(res);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Title level={2}>Property List</Title>
      <Table
        className="properties__table"
        dataSource={requestAssetData}
        columns={requestAssetColumns}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
        onRow={(record: AssetType, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`${URL_PROPERTIES}/${record?._id}`);
            },
          };
        }}
      />
    </div>
  );
};

PorpertiesPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default PorpertiesPage;
