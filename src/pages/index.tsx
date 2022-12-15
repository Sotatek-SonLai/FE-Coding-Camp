import { Table, Tabs, Button, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { ReactElement, useState } from "react";
import {
  passedAssetColumns,
  requestAssetColumns,
} from "../components/PortalEvaluationPage/AssestTable";
import Link from "next/link";
import EvaluationService from "../service/evaluation.service";
import MainLayout from "../components/Main-Layout";
import { NextPageWithLayout } from "./_app";
import { useRouter } from "next/router";
const { Title } = Typography;

const passedAssetData = [
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

const PortalPage = (props: any) => {
  const router = useRouter();
  router.push("/properties");
};

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default PortalPage;
