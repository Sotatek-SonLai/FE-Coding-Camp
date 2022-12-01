import { Table, Tabs, Button, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { ReactElement, useEffect, useState } from "react";
import {
  passedAssetColumns,
  PassedAssetDataType,
  requestAssetColumns,
  RequestAssetDataType,
} from "../../components/PortalEvaluationPage/AssestTable";
import Link from "next/link";
import EvaluationService from "../../service/evaluation.service";
import MainLayout from "../../components/Main-Layout";
import { NextPageWithLayout } from "../_app";
import { AssetType } from "../../types";
import { useRouter } from "next/router";
import { URL_PROPERTIES } from "../../constants";
const { Title } = Typography;

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

const PortalPage: NextPageWithLayout = (props: any) => {
  const [requestAssetData, setRequestAssetData] = useState(null);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const [res]: any = await EvaluationService.getLand();
      setRequestAssetData(res);
    })();
  }, []);
  const items = [
    {
      label: "Request Asset",
      key: "request_asset",
      children: (
        <>
          {requestAssetData && (
            <Table
              dataSource={requestAssetData}
              columns={requestAssetColumns}
              rowKey="_id"
              pagination={{ pageSize: 6 }}
              onRow={(record: AssetType) => {
                return {
                  onClick: (event) => {
                    router.push(`${router.asPath}/${record?._id}`);
                  },
                };
              }}
            />
          )}
        </>
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
      <Title level={2}>Portal Evaluation</Title>
      <div>
        <Space style={{ width: "100%" }} direction="vertical" align="end">
          <Link href="/portal/new" passHref>
            <Button type="primary" icon={<PlusOutlined />}>
              Create New Land
            </Button>
          </Link>
        </Space>
      </div>
      <Tabs items={items} />
    </div>
  );
};

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default PortalPage;
