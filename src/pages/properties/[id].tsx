import {
  Table,
  Tabs,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Avatar,
  Carousel,
  Form,
  Input,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import { AssetType } from "../../types";
import Link from "next/link";
const { Title } = Typography;
import style from "./style.module.scss";
import { configCarousel } from "./utils";

const PortalPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={style.assetDetailContainer}>
      <Row gutter={[20, 0]}>
        <Col span={8}>
          <div className="box info--left">
            <div className="info--left__general">
              <Avatar
                className="logo"
                src="https://joeschmoe.io/api/v1/random"
              />
              <p className="token--name">Token Name: ABC</p>
              <p className="address">Address: 79 Cau Giay, T.P HN</p>
              <p className="address">ID: 123</p>
            </div>
            <Divider orientation="left">Buy ABC (1 USDT = 20 ABC) </Divider>
            <Form
              form={form}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="horizontal"
            >
              <Form.Item
                label="Buy Amount"
                name="amount"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>
              <p className="available--balance">
                Available Balance: 97,420,234.49 USDC
              </p>
              <div className="you--receive">
                <p className="key">You Receive</p>
                <p className="value">0.05 ABC</p>
              </div>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Buy
              </Button>
            </Form>
          </div>
        </Col>
        <Col span={16}>
          <div className="box info--right">
            <Row>
              <Col span={8}>
                <p className="key">Token Total Supply</p>
                <p className="value">10,000,000</p>
              </Col>
              <Col span={8}>
                <p className="key">Token Listing Price</p>
                <p className="value">$0.05</p>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p className="key">Token Listing Date</p>
                <p className="value">30/1/2022</p>
              </Col>
              <Col span={8}>
                <p className="key">Total Token Remain</p>
                <p className="value">10,000,000</p>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p className="key">Claim Reward Date</p>
                <p className="value">5/1 monthly</p>
              </Col>
              <Col span={8}>
                <p className="key">Reward Monthly</p>
                <p className="value">10.000 USDT</p>
              </Col>
            </Row>
            <Divider orientation="left">Project Description </Divider>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <Divider orientation="left">Project Images:</Divider>
            <div className="rowSlide">
              <div className="slide">
                <Carousel {...configCarousel}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => {
                    return (
                      <img
                        className="logo"
                        src="https://joeschmoe.io/api/v1/random"
                        style={{ width: 100, height: 100 }}
                        key={index}
                      />
                    );
                  })}
                </Carousel>
              </div>
            </div>
            <Divider orientation="left">Leagal Papers::</Divider>
            <div className="rowSlide">
              <div className="slide">
                <Carousel {...configCarousel}>
                  {[1, 2, 3, 4].map((item, index) => {
                    return (
                      <img
                        className="logo"
                        src="https://joeschmoe.io/api/v1/random"
                        style={{ width: 100, height: 100 }}
                        key={index}
                      />
                    );
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PortalPage;
