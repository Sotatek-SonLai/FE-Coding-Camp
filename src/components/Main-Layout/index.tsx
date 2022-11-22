import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";

import {
  HomeOutlined,
  PicLeftOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Col, MenuProps, Row, Space } from "antd";
import { Breadcrumb, Layout, Menu, Button, Modal } from "antd";

type MenuItem = Required<MenuProps>["items"][number];
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const DynamicCustomWallet = dynamic(() => import("./CustomWallet"), {
  ssr: false,
});

const { Header, Content, Sider } = Layout;

function getItem(
  label: React.ReactNode,
  to: string | null,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label: to ? <Link href={to}>{label}</Link> : label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Dashboard", "/dashboard", "/dashboard", <HomeOutlined />),
  getItem("Portal Evaluation", "/portal", "/portal", <PicLeftOutlined />),
  getItem("Property List", "/properties", "/properties", <ProjectOutlined />),
];

const MainLayout: React.FC<any> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["/dashboard"]);
  const { pathname } = useRouter();
  const router = useRouter();

  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.set("refreshToken", "");
    router.push("/");
  };

  return (
    <>
      <Layout>
        <Header className="header">
          <div className="logo">
            <img src="/logo.png" alt="" />
          </div>
          <div className="connect-wrap">
            <DynamicCustomWallet />
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: "white" }}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              style={{ height: "200px", borderRight: 0 }}
              items={items}
            />

            <Button
              style={{ display: "block", margin: "auto" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div className="wrapper">{children}</div>
            </Content>
          </Layout>
        </Layout>
      </Layout>

      <Modal
        title="Connect Wallet"
        open={isModalOpen}
        maskClosable={true}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div>.....</div>
      </Modal>
    </>
  );
};

export default MainLayout;
