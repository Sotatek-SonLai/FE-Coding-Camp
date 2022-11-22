import { Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { ReactElement } from "react";
import { AssetType } from "../../types";
import PropertyInfo from "../../components/common/PropertyInfo";
import { useRouter } from "next/router";
const { Title } = Typography;
import { URL_PROPERTIES } from "../../constants";
import MainLayout from "../../components/Main-Layout";

const requestAssetData: AssetType[] = [
  {
    id: "1",
    propertyInfo: "https://joeschmoe.io/api/v1/random",
    name: "ABC",
    totalSupply: 100000,
    tokenPrice: 0.0001,
    detail: "Detail",
    rewardDate: "12/12",
  },
  {
    id: "2",
    propertyInfo: "https://joeschmoe.io/api/v1/random",
    name: "Trinh Thi Thu Trang Trinh Thi Thu Trang Trinh Thi Thu Trang",
    totalSupply: 1000000000,
    tokenPrice: 0.001,
    detail: "Detail",
    rewardDate: "12/3",
  },
];

export const requestAssetColumns: ColumnsType<AssetType> = [
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
    title: "Reward Date",
    dataIndex: "rewardDate",
    key: "rewardDate",
  },
];

const PorpertiesPage = () => {
  const router = useRouter();

  return (
    <div>
      <Title level={2}>Property List</Title>
      <Table
        className="properties__table"
        dataSource={requestAssetData}
        columns={requestAssetColumns}
        rowKey="id"
        onRow={(record: AssetType, rowIndex) => {
          return {
            onClick: (event) => {
              router.push(`${URL_PROPERTIES}/${record?.id}`);
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
