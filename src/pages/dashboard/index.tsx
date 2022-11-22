import React, { ReactElement } from "react";
import { Typography } from "antd";
import { NextPageWithLayout } from "../_app";
import MainLayout from "../../components/Main-Layout";

const { Title } = Typography;

const DashboardPage: NextPageWithLayout = () => {
  return (
    <>
      <Title level={2}>Dashboard page</Title>
      <div className="box">...</div>
    </>
  );
};

DashboardPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default DashboardPage;
